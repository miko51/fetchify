# 💻 Fetchify API - Code Examples

Complete, ready-to-use code examples in various programming languages.

---

## Table of Contents
- [JavaScript/Node.js](#javascript--nodejs)
- [Python](#python)
- [PHP](#php)
- [Ruby](#ruby)
- [Go](#go)
- [Java](#java)
- [C#](#c)
- [Postman Collection](#postman-collection)

---

## JavaScript / Node.js

### Basic Example with Fetch

```javascript
const API_KEY = process.env.FETCHIFY_API_KEY;

async function getProductData(productUrl) {
  try {
    const response = await fetch(
      `https://fetchify.app/api/v1/product-crawl?url=${encodeURIComponent(productUrl)}`,
      {
        headers: {
          'X-API-Key': API_KEY
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error.message);
    throw error;
  }
}

// Usage
getProductData('https://www.amazon.com/dp/B08N5WRWNW')
  .then(data => {
    console.log('Product:', data.data.title);
    console.log('Price:', data.data.price);
    console.log('Credits remaining:', data.credits.remaining);
  })
  .catch(error => console.error(error));
```

### With Axios

```javascript
const axios = require('axios');

const fetchify = axios.create({
  baseURL: 'https://fetchify.app/api/v1',
  headers: {
    'X-API-Key': process.env.FETCHIFY_API_KEY
  }
});

async function getProduct(url) {
  try {
    const response = await fetchify.get('/product-crawl', {
      params: { url }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
    throw error;
  }
}

// Check credits
async function getCredits() {
  const response = await fetchify.get('/credits/balance');
  return response.data.credits;
}

// Usage
(async () => {
  const product = await getProduct('https://example.com/product');
  const credits = await getCredits();
  
  console.log(`Product: ${product.data.title}`);
  console.log(`Credits: ${credits}`);
})();
```

### Express.js API Wrapper

```javascript
const express = require('express');
const axios = require('axios');

const app = express();
const fetchify = axios.create({
  baseURL: 'https://fetchify.app/api/v1',
  headers: { 'X-API-Key': process.env.FETCHIFY_API_KEY }
});

app.get('/api/products', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    const response = await fetchify.get('/product-crawl', {
      params: { url }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Internal server error'
    });
  }
});

app.listen(3000, () => {
  console.log('API wrapper running on port 3000');
});
```

---

## Python

### Basic Example with Requests

```python
import os
import requests
from typing import Dict, Any

API_KEY = os.getenv('FETCHIFY_API_KEY')
BASE_URL = 'https://fetchify.app/api/v1'

def get_product(product_url: str) -> Dict[str, Any]:
    """Fetch product data from Fetchify API"""
    
    headers = {'X-API-Key': API_KEY}
    params = {'url': product_url}
    
    response = requests.get(
        f'{BASE_URL}/product-crawl',
        headers=headers,
        params=params
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        error = response.json()
        raise Exception(f"API Error: {error.get('error', 'Unknown error')}")

def check_credits() -> int:
    """Check remaining credits"""
    
    headers = {'X-API-Key': API_KEY}
    response = requests.get(f'{BASE_URL}/credits/balance', headers=headers)
    
    if response.status_code == 200:
        return response.json()['credits']
    else:
        raise Exception('Failed to fetch credits')

# Usage
if __name__ == '__main__':
    product = get_product('https://www.amazon.com/dp/B08N5WRWNW')
    
    print(f"Product: {product['data']['title']}")
    print(f"Price: ${product['data']['price']}")
    print(f"Credits remaining: {product['credits']['remaining']}")
    
    credits = check_credits()
    print(f"Total credits: {credits}")
```

### Django Integration

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import requests
import os

FETCHIFY_API_KEY = os.getenv('FETCHIFY_API_KEY')

@require_http_methods(["GET"])
def fetch_product(request):
    product_url = request.GET.get('url')
    
    if not product_url:
        return JsonResponse({'error': 'URL parameter required'}, status=400)
    
    try:
        response = requests.get(
            'https://fetchify.app/api/v1/product-crawl',
            headers={'X-API-Key': FETCHIFY_API_KEY},
            params={'url': product_url}
        )
        
        return JsonResponse(response.json(), status=response.status_code)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
```

### Async with aiohttp

```python
import aiohttp
import asyncio
import os

API_KEY = os.getenv('FETCHIFY_API_KEY')

async def fetch_product_async(session, product_url):
    """Async product fetch"""
    
    headers = {'X-API-Key': API_KEY}
    params = {'url': product_url}
    
    async with session.get(
        'https://fetchify.app/api/v1/product-crawl',
        headers=headers,
        params=params
    ) as response:
        return await response.json()

async def fetch_multiple_products(product_urls):
    """Fetch multiple products concurrently"""
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_product_async(session, url) for url in product_urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

# Usage
urls = [
    'https://example.com/product1',
    'https://example.com/product2',
    'https://example.com/product3'
]

results = asyncio.run(fetch_multiple_products(urls))
for result in results:
    if isinstance(result, dict):
        print(f"Product: {result['data']['title']}")
```

---

## PHP

### Basic Example with cURL

```php
<?php

class FetchifyClient {
    private $apiKey;
    private $baseUrl = 'https://fetchify.app/api/v1';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    public function getProduct($productUrl) {
        $url = $this->baseUrl . '/product-crawl?' . http_build_query([
            'url' => $productUrl
        ]);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-API-Key: ' . $this->apiKey
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            $error = json_decode($response, true);
            throw new Exception($error['error'] ?? 'API request failed');
        }
        
        return json_decode($response, true);
    }
    
    public function getCredits() {
        $url = $this->baseUrl . '/credits/balance';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-API-Key: ' . $this->apiKey
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true)['credits'];
    }
}

// Usage
$fetchify = new FetchifyClient($_ENV['FETCHIFY_API_KEY']);

try {
    $product = $fetchify->getProduct('https://www.amazon.com/dp/B08N5WRWNW');
    echo "Product: " . $product['data']['title'] . "\n";
    echo "Price: $" . $product['data']['price'] . "\n";
    echo "Credits: " . $product['credits']['remaining'] . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
```

### Laravel Integration

```php
<?php
// app/Services/FetchifyService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FetchifyService {
    protected $apiKey;
    protected $baseUrl = 'https://fetchify.app/api/v1';
    
    public function __construct() {
        $this->apiKey = config('services.fetchify.api_key');
    }
    
    public function getProduct(string $url): array {
        $response = Http::withHeaders([
            'X-API-Key' => $this->apiKey
        ])->get($this->baseUrl . '/product-crawl', [
            'url' => $url
        ]);
        
        return $response->throw()->json();
    }
}

// Usage in controller
use App\Services\FetchifyService;

public function show(Request $request, FetchifyService $fetchify) {
    $data = $fetchify->getProduct($request->input('url'));
    return response()->json($data);
}
```

---

## Ruby

### Basic Example

```ruby
require 'net/http'
require 'json'
require 'uri'

class FetchifyClient
  BASE_URL = 'https://fetchify.app/api/v1'
  
  def initialize(api_key)
    @api_key = api_key
  end
  
  def get_product(product_url)
    uri = URI("#{BASE_URL}/product-crawl")
    uri.query = URI.encode_www_form(url: product_url)
    
    request = Net::HTTP::Get.new(uri)
    request['X-API-Key'] = @api_key
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    if response.code == '200'
      JSON.parse(response.body)
    else
      error = JSON.parse(response.body)
      raise "API Error: #{error['error']}"
    end
  end
  
  def get_credits
    uri = URI("#{BASE_URL}/credits/balance")
    request = Net::HTTP::Get.new(uri)
    request['X-API-Key'] = @api_key
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end
    
    JSON.parse(response.body)['credits']
  end
end

# Usage
client = FetchifyClient.new(ENV['FETCHIFY_API_KEY'])
product = client.get_product('https://www.amazon.com/dp/B08N5WRWNW')

puts "Product: #{product['data']['title']}"
puts "Price: $#{product['data']['price']}"
puts "Credits: #{product['credits']['remaining']}"
```

---

## Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
    "os"
)

type FetchifyClient struct {
    APIKey  string
    BaseURL string
}

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

func NewFetchifyClient(apiKey string) *FetchifyClient {
    return &FetchifyClient{
        APIKey:  apiKey,
        BaseURL: "https://fetchify.app/api/v1",
    }
}

func (c *FetchifyClient) GetProduct(productURL string) (*ProductResponse, error) {
    u, _ := url.Parse(c.BaseURL + "/product-crawl")
    q := u.Query()
    q.Set("url", productURL)
    u.RawQuery = q.Encode()

    req, _ := http.NewRequest("GET", u.String(), nil)
    req.Header.Add("X-API-Key", c.APIKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)

    if resp.StatusCode != 200 {
        return nil, fmt.Errorf("API error: %s", string(body))
    }

    var result ProductResponse
    json.Unmarshal(body, &result)
    
    return &result, nil
}

func main() {
    client := NewFetchifyClient(os.Getenv("FETCHIFY_API_KEY"))
    
    product, err := client.GetProduct("https://www.amazon.com/dp/B08N5WRWNW")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }

    fmt.Printf("Product: %s\n", product.Data.Title)
    fmt.Printf("Price: $%.2f\n", product.Data.Price)
    fmt.Printf("Credits remaining: %d\n", product.Credits.Remaining)
}
```

---

## Java

```java
import java.net.http.*;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.google.gson.*;

public class FetchifyClient {
    private final String apiKey;
    private final String baseUrl = "https://fetchify.app/api/v1";
    private final HttpClient client;
    private final Gson gson;
    
    public FetchifyClient(String apiKey) {
        this.apiKey = apiKey;
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    public ProductResponse getProduct(String productUrl) throws Exception {
        String encodedUrl = URLEncoder.encode(productUrl, StandardCharsets.UTF_8);
        String url = baseUrl + "/product-crawl?url=" + encodedUrl;
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("X-API-Key", apiKey)
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            return gson.fromJson(response.body(), ProductResponse.class);
        } else {
            throw new Exception("API Error: " + response.body());
        }
    }
    
    public static void main(String[] args) {
        FetchifyClient fetchify = new FetchifyClient(System.getenv("FETCHIFY_API_KEY"));
        
        try {
            ProductResponse product = fetchify.getProduct("https://www.amazon.com/dp/B08N5WRWNW");
            System.out.println("Product: " + product.data.title);
            System.out.println("Price: $" + product.data.price);
            System.out.println("Credits: " + product.credits.remaining);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

## C#

```csharp
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class FetchifyClient
{
    private readonly string _apiKey;
    private readonly string _baseUrl = "https://fetchify.app/api/v1";
    private readonly HttpClient _client;
    
    public FetchifyClient(string apiKey)
    {
        _apiKey = apiKey;
        _client = new HttpClient();
        _client.DefaultRequestHeaders.Add("X-API-Key", apiKey);
    }
    
    public async Task<ProductResponse> GetProductAsync(string productUrl)
    {
        var url = $"{_baseUrl}/product-crawl?url={Uri.EscapeDataString(productUrl)}";
        var response = await _client.GetAsync(url);
        
        var content = await response.Content.ReadAsStringAsync();
        
        if (response.IsSuccessStatusCode)
        {
            return JsonConvert.DeserializeObject<ProductResponse>(content);
        }
        else
        {
            throw new Exception($"API Error: {content}");
        }
    }
    
    public static async Task Main(string[] args)
    {
        var fetchify = new FetchifyClient(Environment.GetEnvironmentVariable("FETCHIFY_API_KEY"));
        
        try
        {
            var product = await fetchify.GetProductAsync("https://www.amazon.com/dp/B08N5WRWNW");
            Console.WriteLine($"Product: {product.Data.Title}");
            Console.WriteLine($"Price: ${product.Data.Price}");
            Console.WriteLine($"Credits: {product.Credits.Remaining}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

---

## Postman Collection

### Import this JSON into Postman

```json
{
  "info": {
    "name": "Fetchify API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://fetchify.app/api/v1"
    },
    {
      "key": "api_key",
      "value": "YOUR_API_KEY_HERE"
    }
  ],
  "item": [
    {
      "name": "Product Crawl",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/product-crawl?url=https://www.amazon.com/dp/B08N5WRWNW",
          "host": ["{{base_url}}"],
          "path": ["product-crawl"],
          "query": [
            {
              "key": "url",
              "value": "https://www.amazon.com/dp/B08N5WRWNW"
            }
          ]
        }
      }
    },
    {
      "name": "Check Credits",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/credits/balance",
          "host": ["{{base_url}}"],
          "path": ["credits", "balance"]
        }
      }
    }
  ]
}
```

---

**Need more examples?** Contact support@fetchify.app
