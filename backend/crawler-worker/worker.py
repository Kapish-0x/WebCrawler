import json
import requests
from kafka import KafkaConsumer, KafkaProducer
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

# --- Your Helper Functions ---

def parse_and_extract(html_content, current_url):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    for script in soup(["script", "style"]):
        script.extract()
        
    clean_text = soup.get_text(separator='\n')
    lines = (line.strip() for line in clean_text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    final_text = '\n'.join(chunk for chunk in chunks if chunk)
    
    internal_links = []
    parsed_current = urlparse(current_url)
    base_domain = parsed_current.netloc 
    
    for anchor in soup.find_all('a', href=True):
        href = anchor['href']
        full_url = urljoin(current_url, href)
        parsed_target = urlparse(full_url)
        
        if parsed_target.netloc == base_domain:
            normalized_url = full_url.split('#')[0]
            if normalized_url not in internal_links:
                internal_links.append(normalized_url)
                
    return final_text, internal_links


# --- 🎯 THE REAL DISTRIBUTED PIPELINE ENGINE ---

def start_worker():
    print("==================================================")
    print("⚡ Python Crawler Worker Initialized & Listening...")
    print("==================================================")
    
    # 1. Connect Kafka Consumer to read work orders
    consumer = KafkaConsumer(
        'crawl-commands',
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='latest',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    
    # 2. ⚡ ADDED: Connect Kafka Producer to pass child links back into the loop
    producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    try:
        for message in consumer:
            command_data = message.value
            target_url = command_data.get('url') or command_data.get('seedUrl')
            job_id = command_data.get('jobId')
            current_depth = command_data.get('depthLevel', 1)
            max_depth = command_data.get('maxDepth', 2) # Prevents infinite memory loops
            
            if not target_url:
                continue
                
            print(f"\n📥 Received crawl task for URL: {target_url} (Depth: {current_depth}/{max_depth})")
            
            try:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                response = requests.get(target_url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    clean_text, discovered_links = parse_and_extract(response.text, target_url)
                    print(f"✅ Extracted {len(clean_text)} bytes and found {len(discovered_links)} internal links!")
                    
                    # 🚀 ACTION A: Send the scraped content payload to your Express consumer endpoint
                    # This tells Node to instantly push the plain text into your Elasticsearch cluster index!
                    try:
                        # Double-check if your consumer path endpoint matches your express consumer setup
                        node_webhook_url = "http://localhost:5000/api/pages/index" 
                        payload = {
                            "jobId": job_id,
                            "url": target_url,
                            "content": clean_text
                        }
                        res = requests.post(node_webhook_url, json=payload, timeout=5)
                        print(f"📡 Forwarded payload to Express server. Status: {res.status_code}")
                    except Exception as node_err:
                        print(f"⚠️ Failed to forward text to Express webhook: {node_err}")

                    # 🔄 ACTION B: Schedule recursive discovery paths over Kafka
                    if current_depth < max_depth:
                        print(f"🔗 Re-routing {len(discovered_links)} sub-links to Kafka queue...")
                        for link in discovered_links:
                            new_command = {
                                "jobId": job_id,
                                "url": link,
                                "depthLevel": current_depth + 1,
                                "maxDepth": max_depth
                            }
                            producer.send('crawl-commands', new_command)
                        producer.flush()
                        
                else:
                    print(f"❌ Failed to scrape page. Status: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Error handling crawl execution loop: {str(e)}")
                
    except KeyboardInterrupt:
        print("\n🛑 Worker shutting down gracefully...")

if __name__ == "__main__":
    start_worker()