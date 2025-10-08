# 🚀 Fetchify API - Quick Start Guide

Get started with Fetchify API in 5 minutes!

---

## Step 1: Create an Account

1. Go to [fetchify.app/signup](https://fetchify.app/signup)
2. Enter your email and password
3. Verify your email (if required)
4. Get 10 free credits to test the API! 🎉

---

## Step 2: Generate Your API Key

1. Log in to [fetchify.app/dashboard](https://fetchify.app/dashboard)
2. Navigate to **API Keys** in the sidebar
3. Click **"Generate New Key"**
4. Give your key a name (e.g., "My App Production")
5. Copy your API key and store it securely

⚠️ **Important:** Keep your API key secret! Never commit it to version control.

---

## Step 3: Make Your First Request

### Using cURL (Terminal)

```bash
curl "https://fetchify.app/api/v1/product-crawl?url=https://www.amazon.com/dp/B08N5WRWNW&apiKey=YOUR_API_KEY"
```

### Using JavaScript (Browser or Node.js)

```javascript
fetch('https://fetchify.app/api/v1/product-crawl?url=https://www.amazon.com/dp/B08N5WRWNW', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Product:', data.data.title);
  console.log('Price:', data.data.price);
  console.log('Credits remaining:', data.credits.remaining);
})
.catch(error => console.error('Error:', error));
```

### Using Python

```python
import requests

response = requests.get(
    'https://fetchify.app/api/v1/product-crawl',
    headers={'X-API-Key': 'YOUR_API_KEY'},
    params={'url': 'https://www.amazon.com/dp/B08N5WRWNW'}
)

data = response.json()
print(f"Product: {data['data']['title']}")
print(f"Price: ${data['data']['price']}")
print(f"Credits remaining: {data['credits']['remaining']}")
```

---

## Step 4: Handle the Response

### Success Response

```json
{
  "data": {
    "title": "Apple AirPods Pro",
    "price": 249.00,
    "currency": "USD",
    "description": "Active Noise Cancellation...",
    "images": ["https://...jpg"],
    "availability": "in_stock",
    "rating": 4.7,
    "reviews_count": 89234
  },
  "credits": {
    "remaining": 499,
    "used": 1
  }
}
```

### Error Response

```json
{
  "error": "Crédits insuffisants",
  "credits": 0,
  "message": "Veuillez acheter des crédits pour continuer"
}
```

---

## Step 5: Buy More Credits

When you run out of credits:

1. Go to [fetchify.app/dashboard/credits](https://fetchify.app/dashboard/credits)
2. Choose a credit package
3. Complete payment via Stripe
4. Credits are added instantly! ⚡

### Credit Packages

| Package | Credits | Price | Price per 1K credits |
|---------|---------|-------|---------------------|
| Starter | 1,000 | $50 | $50 |
| Pro | 10,000 | $400 | $40 |
| Business | 50,000 | $1,500 | $30 |
| Enterprise | 100,000+ | Custom | Contact us |

---

## 🎯 Common Use Cases

### 1. Price Monitoring
Track competitor prices in real-time:
```javascript
async function trackPrice(productUrl) {
  const response = await fetch(`https://fetchify.app/api/v1/product-crawl?url=${productUrl}`, {
    headers: { 'X-API-Key': API_KEY }
  });
  const data = await response.json();
  
  // Store price in database
  await db.prices.insert({
    product: data.data.title,
    price: data.data.price,
    timestamp: new Date()
  });
}

// Run every hour
setInterval(() => trackPrice('https://example.com/product'), 3600000);
```

### 2. Product Catalog Sync
Sync products from multiple suppliers:
```python
def sync_products(supplier_urls):
    for url in supplier_urls:
        response = requests.get(
            'https://fetchify.app/api/v1/product-crawl',
            headers={'X-API-Key': API_KEY},
            params={'url': url}
        )
        product = response.json()['data']
        
        # Update your database
        db.products.upsert({
            'sku': product['sku'],
            'name': product['title'],
            'price': product['price'],
            'stock': product['availability']
        })
```

### 3. Affiliate Product Discovery
Find products to promote:
```javascript
async function findProducts(searchUrls) {
  const products = [];
  
  for (const url of searchUrls) {
    const response = await fetch(
      `https://fetchify.app/api/v1/product-crawl?url=${url}`,
      { headers: { 'X-API-Key': API_KEY } }
    );
    const data = await response.json();
    
    // Filter by rating and price
    if (data.data.rating >= 4.5 && data.data.price <= 100) {
      products.push(data.data);
    }
  }
  
  return products;
}
```

---

## 🛡️ Best Practices

### ✅ DO
- ✅ Store API keys in environment variables
- ✅ Cache product data when possible
- ✅ Handle errors gracefully
- ✅ Monitor your credit usage
- ✅ Use meaningful API key names

### ❌ DON'T
- ❌ Commit API keys to Git
- ❌ Share API keys publicly
- ❌ Make excessive requests
- ❌ Ignore error responses
- ❌ Use test keys in production

---

## 📚 Next Steps

- 📖 Read the [Full API Documentation](./API_DOCUMENTATION.md)
- 💻 Check out [Code Examples](./API_EXAMPLES.md)
- 🎓 Watch our [Video Tutorials](https://fetchify.app/tutorials)
- 💬 Join our [Discord Community](https://discord.gg/fetchify)

---

## 🆘 Need Help?

- 📧 Email: support@fetchify.app
- 💬 Live Chat: [fetchify.app/support](https://fetchify.app/support)
- 📚 Documentation: [docs.fetchify.app](https://docs.fetchify.app)

---

**Happy Coding! 🚀**
