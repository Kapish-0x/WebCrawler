import json
import requests
import time
import random
from kafka import KafkaConsumer, KafkaProducer
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --- Human-like Headers ---
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
]

# 1. Initialize session with Retries to handle 10054 Connection Resets
session = requests.Session()
retries = Retry(
    total=3, 
    backoff_factor=2, 
    status_forcelist=[500, 502, 503, 504],
    allowed_methods=["GET"]
)
session.mount("https://", HTTPAdapter(max_retries=retries))
session.mount("http://", HTTPAdapter(max_retries=retries))

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

def start_worker():
    print("==================================================")
    print("⚡ Python Crawler Worker Initialized & Listening...")
    print("==================================================")
    
    consumer = KafkaConsumer(
        'crawl-commands',
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='latest',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )
    
    producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    for message in consumer:
        command_data = message.value
        target_url = command_data.get('url') or command_data.get('seedUrl')
        job_id = command_data.get('jobId')
        current_depth = command_data.get('depthLevel', 1)
        max_depth = command_data.get('maxDepth', 2)
        
        if not target_url: continue
            
        print(f"\n📥 Received task: {target_url} (Depth: {current_depth})")
        
        try:
            time.sleep(random.uniform(2, 5)) # Increased delay to be safer
            
            headers = {
                'User-Agent': random.choice(USER_AGENTS),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/'
            }
            
            response = session.get(target_url, headers=headers, timeout=20)
            
            if response.status_code == 200:
                clean_text, discovered_links = parse_and_extract(response.text, target_url)
                print(f"✅ Extracted data from: {target_url}")
                
                # Forward to Express
                try:
                    res = requests.post("http://localhost:5000/api/pages/index", 
                                        json={"jobId": job_id, "url": target_url, "content": clean_text}, 
                                        timeout=5)
                except: pass

                # Recursive discovery
                if current_depth < max_depth:
                    for link in discovered_links:
                        producer.send('crawl-commands', {
                            "jobId": job_id, "url": link, 
                            "depthLevel": current_depth + 1, "maxDepth": max_depth
                        })
                    producer.flush()
            else:
                print(f"❌ Status {response.status_code} for {target_url}")
                
        except Exception as e:
            print(f"❌ Connection Issue (Retrying next task): {str(e)}")

if __name__ == "__main__":
    start_worker()