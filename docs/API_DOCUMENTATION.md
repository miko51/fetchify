# 📘 Fetchify API Documentation

**Version:** 1.0.0  
**Base URL:** `https://fetchify.app/api/v1`  
**Base URL (Staging):** `https://staging.fetchify.app/api/v1`

---

## 🔐 Authentication

Fetchify API uses API keys for authentication. You can generate your API key from your dashboard at [fetchify.app/dashboard/keys](https://fetchify.app/dashboard/keys).

### Authentication Methods

The API supports **4 authentication methods**:

#### 1. Query Parameter (Recommended for simple requests)
```bash
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL&apiKey=YOUR_API_KEY
```

#### 2. Query Parameter (lowercase)
```bash
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL&apikey=YOUR_API_KEY
```

#### 3. X-API-Key Header (Recommended for production)
```bash
curl -H "X-API-Key: YOUR_API_KEY" "https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL"
```

#### 4. Authorization Bearer Header
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" "https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL"
```

---

## 📊 API Endpoints

### 1. Product Crawl

Extract detailed product information from any e-commerce website.

**Endpoint:** `GET /api/v1/product-crawl`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | The full URL of the product page |
| `apiKey` or `apikey` | string | Yes* | Your API key (if using query param auth) |

*Required if not using header authentication

**Request Example:**

```bash
curl "https://fetchify.app/api/v1/product-crawl?url=https://example.com/product/123&apiKey=YOUR_API_KEY"
```

**Success Response (200 OK):**

```json
{
  "data": {
    "title": "Product Name",
    "price": 99.99,
    "currency": "USD",
    "description": "Full product description",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "availability": "in_stock",
    "brand": "Brand Name",
    "sku": "PROD-123",
    "rating": 4.5,
    "reviews_count": 128,
    "specifications": {
      "color": "Blue",
      "size": "Large",
      "weight": "500g"
    },
    "categories": ["Electronics", "Gadgets"],
    "url": "https://example.com/product/123",
    "crawled_at": "2025-10-08T12:00:00Z"
  },
  "credits": {
    "remaining": 499,
    "used": 1
  },
  "meta": {
    "request_id": "req_abc123",
    "processing_time_ms": 2341
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized - Invalid or missing API key
{
  "error": "API key missing. Use '?apiKey=YOUR_KEY' in URL or 'X-API-Key' header",
  "code": "UNAUTHORIZED"
}

// 402 Payment Required - Insufficient credits
{
  "error": "Crédits insuffisants",
  "credits": 0,
  "message": "Veuillez acheter des crédits pour continuer à utiliser l'API",
  "code": "INSUFFICIENT_CREDITS"
}

// 400 Bad Request - Missing URL parameter
{
  "error": "URL du produit manquante. Utilisez '?url=YOUR_PRODUCT_URL'",
  "code": "MISSING_PARAMETER"
}

// 403 Forbidden - API key disabled
{
  "error": "Clé API désactivée",
  "code": "API_KEY_DISABLED"
}

// 500 Internal Server Error
{
  "error": "Erreur de l'API externe",
  "credits": {
    "remaining": 498,
    "used": 1
  },
  "code": "EXTERNAL_API_ERROR"
}
```

---

### 2. Check Credits Balance

Get your current credit balance.

**Endpoint:** `GET /api/credits/balance`

**Authentication:** Required (Header only)

**Request Example:**

```bash
curl -H "X-API-Key: YOUR_API_KEY" "https://fetchify.app/api/credits/balance"
```

**Success Response (200 OK):**

```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "credits": 1500,
  "balance": 1500
}
```

---

## 📝 Code Examples

### JavaScript (Node.js)

```javascript
const fetch = require('node-fetch');

const API_KEY = 'your_api_key_here';
const PRODUCT_URL = 'https://example.com/product/123';

async function fetchProduct() {
  try {
    const response = await fetch(
      `https://fetchify.app/api/v1/product-crawl?url=${encodeURIComponent(PRODUCT_URL)}`,
      {
        headers: {
          'X-API-Key': API_KEY
        }
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Product data:', data.data);
      console.log('Credits remaining:', data.credits.remaining);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

fetchProduct();
```

### Python

```python
import requests

API_KEY = 'your_api_key_here'
PRODUCT_URL = 'https://example.com/product/123'

headers = {
    'X-API-Key': API_KEY
}

params = {
    'url': PRODUCT_URL
}

response = requests.get(
    'https://fetchify.app/api/v1/product-crawl',
    headers=headers,
    params=params
)

if response.status_code == 200:
    data = response.json()
    print('Product data:', data['data'])
    print('Credits remaining:', data['credits']['remaining'])
else:
    print('Error:', response.json()['error'])
```

### PHP

```php
<?php

$apiKey = 'your_api_key_here';
$productUrl = 'https://example.com/product/123';

$url = 'https://fetchify.app/api/v1/product-crawl?' . http_build_query([
    'url' => $productUrl
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "Product: " . $data['data']['title'] . "\n";
    echo "Credits remaining: " . $data['credits']['remaining'] . "\n";
} else {
    $error = json_decode($response, true);
    echo "Error: " . $error['error'] . "\n";
}
```

### cURL

```bash
# Using header authentication (recommended)
curl -X GET "https://fetchify.app/api/v1/product-crawl?url=https://example.com/product/123" \
  -H "X-API-Key: YOUR_API_KEY"

# Using query parameter (simpler)
curl -X GET "https://fetchify.app/api/v1/product-crawl?url=https://example.com/product/123&apiKey=YOUR_API_KEY"
```

### Ruby

```ruby
require 'net/http'
require 'json'
require 'uri'

api_key = 'your_api_key_here'
product_url = 'https://example.com/product/123'

uri = URI('https://fetchify.app/api/v1/product-crawl')
uri.query = URI.encode_www_form(url: product_url)

request = Net::HTTP::Get.new(uri)
request['X-API-Key'] = api_key

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

if response.code == '200'
  data = JSON.parse(response.body)
  puts "Product: #{data['data']['title']}"
  puts "Credits remaining: #{data['credits']['remaining']}"
else
  error = JSON.parse(response.body)
  puts "Error: #{error['error']}"
end
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
)

type ProductResponse struct {
    Data struct {
        Title       string   `json:"title"`
        Price       float64  `json:"price"`
        Description string   `json:"description"`
        Images      []string `json:"images"`
    } `json:"data"`
    Credits struct {
        Remaining int `json:"remaining"`
        Used      int `json:"used"`
    } `json:"credits"`
}

func main() {
    apiKey := "your_api_key_here"
    productURL := "https://example.com/product/123"

    baseURL, _ := url.Parse("https://fetchify.app/api/v1/product-crawl")
    params := url.Values{}
    params.Add("url", productURL)
    baseURL.RawQuery = params.Encode()

    req, _ := http.NewRequest("GET", baseURL.String(), nil)
    req.Header.Add("X-API-Key", apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)

    if resp.StatusCode == 200 {
        var result ProductResponse
        json.Unmarshal(body, &result)
        fmt.Printf("Product: %s\n", result.Data.Title)
        fmt.Printf("Credits remaining: %d\n", result.Credits.Remaining)
    } else {
        fmt.Printf("Error: %s\n", string(body))
    }
}
```

---

## 🎯 Best Practices

### 1. **Error Handling**
Always check the HTTP status code and handle errors appropriately:
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Invalid API key
- `402 Payment Required` - Insufficient credits
- `403 Forbidden` - API key disabled
- `500 Internal Server Error` - Server error

### 2. **Rate Limiting**
There are no hard rate limits, but usage is limited by your credit balance. Each request consumes 1 credit.

### 3. **Caching**
Cache product data when possible to avoid unnecessary API calls and save credits.

### 4. **URL Encoding**
Always URL-encode the product URL parameter:
```javascript
encodeURIComponent(productUrl)
```

### 5. **API Key Security**
- **Never** commit API keys to version control
- Use environment variables to store API keys
- Rotate keys regularly
- Use different keys for development and production

### 6. **Monitoring**
Monitor your credit usage in the dashboard at [fetchify.app/dashboard](https://fetchify.app/dashboard)

---

## 📊 Response Times

| Metric | Average | 95th Percentile |
|--------|---------|-----------------|
| API Response Time | 2-3 seconds | 5 seconds |
| Uptime SLA | 99.9% | - |

---

## 🔄 Webhooks (Coming Soon)

Receive real-time notifications about your account events:
- Credit balance updates
- API key usage alerts
- Payment confirmations

---

## 🆘 Support

### Getting Help
- 📧 Email: support@fetchify.app
- 📚 Documentation: [docs.fetchify.app](https://docs.fetchify.app)
- 💬 Discord: [discord.gg/fetchify](https://discord.gg/fetchify)
- 🐦 Twitter: [@fetchifyapp](https://twitter.com/fetchifyapp)

### Report Issues
Found a bug? Report it at [github.com/fetchify/issues](https://github.com/fetchify/issues)

---

## 📜 Changelog

### v1.0.0 (October 2025)
- Initial release
- Product crawl endpoint
- Multi-language support (EN, FR, ES, IT, DE)
- 4 authentication methods
- Credit system

---

## 📄 Terms of Service

By using the Fetchify API, you agree to our [Terms of Service](https://fetchify.app/terms) and [Privacy Policy](https://fetchify.app/privacy).

### Fair Use Policy
- Respect website terms of service
- Do not abuse the API with excessive requests
- Do not scrape personal data without consent
- Use the API for legitimate business purposes only

---

## 🔒 Security

### Report Security Issues
If you discover a security vulnerability, please email security@fetchify.app

**Do not** open public issues for security vulnerabilities.

---

**Last Updated:** October 8, 2025  
**API Version:** 1.0.0  
**Documentation Version:** 1.0.0
