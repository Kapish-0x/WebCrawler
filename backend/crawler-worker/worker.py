import json
import time
import secrets
import requests
from urllib.parse import urlparse  # Used to cleanly parse the domain
from bs4 import BeautifulSoup
from kafka import KafkaConsumer, KafkaProducer

# Initialize Kafka Connections
consumer = KafkaConsumer(
    'crawl-commands',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda x: json.loads(x.decode('utf-8')),
    group_id='python-crawler-group'
)

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

print("==================================================")
print("🐍 Python WebCrawler Worker is online and listening...")
print("==================================================")

def scrape_page(url):
    """Fetches a URL, extracts title, and strips away HTML tags for readable text."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract page title safely
            page_title = soup.title.string.strip() if soup.title and soup.title.string else "Untitled Page"
            
            # Strip out visual noise
            for script in soup(["script", "style"]):
                script.extract()
                
            clean_text = soup.get_text(separator=' ', strip=True)
            return clean_text, page_title
        else:
            print(f"⚠️ Failed to fetch {url}. Status code: {response.status_code}")
            return None, "Untitled Page"
    except Exception as e:
        print(f"❌ Error scraping {url}: {str(e)}")
        return None, "Untitled Page"

# Main Event Loop
for message in consumer:
    command = message.value
    job_id = command.get('jobId')
    seed_url = command.get('seedUrl')
    max_depth = command.get('maxDepth', 1) # Read the depth layer configuration
    
    print(f"\n📥 Received crawl command for Job: {job_id} -> Target: {seed_url}")
    
    raw_content, title = scrape_page(seed_url)
    
    if raw_content:
        fake_object_id = secrets.token_hex(12)
        
        # Extract the pure domain (e.g., "example.com") required by your schema
        parsed_url = urlparse(seed_url)
        domain_name = parsed_url.netloc if parsed_url.netloc else parsed_url.path
        
        # 🎯 Align payload perfectly to the properties required by CrawlPage schema!
        payload = {
            "pageId": fake_object_id, 
            "jobId": job_id,
            "url": seed_url,
            "domain": domain_name,          # Matches required: true field
            "title": title,                 # Matches optional title
            "crawlStatus": "processing",    # Matches schema enum: ["discovered", "processing", "indexed", "failed"]
            "depthLevel": 1,                # Matches tracking structural depth layer requirement
            "rawContent": raw_content
        }
        
        producer.send('crawled-pages', value=payload)
        producer.flush()
        print(f"📤 Successfully sent aligned schema data for {seed_url} back to Kafka.")