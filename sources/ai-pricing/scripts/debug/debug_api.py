#!/usr/bin/env python
"""Debug script to see raw API response."""
import sys
sys.path.insert(0, '.')

from src.core.fetching.vinted import load_cookies_from_file, get_cookie_header, set_session_cookies
from curl_cffi import requests as cffi_requests

# Load cookies
cookies = load_cookies_from_file('www.vinted.fr_cookies.txt')
set_session_cookies(cookies)
cookie_header = get_cookie_header()

url = 'https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=10&search_text=Nike'

headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://www.vinted.fr/',
}
if cookie_header:
    headers['Cookie'] = cookie_header
    print(f"Using {len(cookies)} cookies")

print(f"\nFetching: {url[:80]}...")
resp = cffi_requests.get(url, headers=headers, impersonate='chrome', timeout=15)

with open('debug_response.txt', 'w', encoding='utf-8') as f:
    f.write(f"Status: {resp.status_code}\n")
    f.write(f"Content-Type: {resp.headers.get('content-type', 'unknown')}\n")
    f.write(f"Response Length: {len(resp.text)} chars\n\n")
    f.write("="*60 + "\n")
    f.write("FIRST 2000 CHARS OF RESPONSE:\n")
    f.write("="*60 + "\n")
    f.write(resp.text[:2000])

print(f"Status: {resp.status_code}")
print(f"Content-Type: {resp.headers.get('content-type', 'unknown')}")
print("Response saved to debug_response.txt")
