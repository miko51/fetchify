# 📚 Fetchify API Documentation

Welcome to the Fetchify API documentation!

## Quick Links

- 🚀 [Quick Start Guide](./API_QUICKSTART.md) - Get started in 5 minutes
- 📖 [Full API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- 💻 [Code Examples](./API_EXAMPLES.md) - Ready-to-use code in 8+ languages
- 🔧 [OpenAPI Specification](./openapi.yaml) - For Swagger/Postman

## What is Fetchify?

Fetchify is a powerful API that extracts detailed product information from any e-commerce website. Get prices, descriptions, images, ratings, and more in real-time with a simple API call.

## Features

✅ **4 Authentication Methods** - Query param, X-API-Key, Bearer token, or lowercase apikey  
✅ **Thousands of Sites Supported** - Amazon, eBay, Shopify, and more  
✅ **Fast Response Times** - Average 2-3 seconds  
✅ **99.9% Uptime** - Reliable and production-ready  
✅ **Multilingual** - Available in EN, FR, ES, IT, DE  
✅ **Simple Pricing** - Pay-as-you-go credits, no subscriptions  

## Getting Started

### 1. Create an Account
Sign up at [fetchify.app/signup](https://fetchify.app/signup) and get 10 free credits!

### 2. Generate an API Key
Go to your [dashboard](https://fetchify.app/dashboard/keys) and create a new API key.

### 3. Make Your First Request

```bash
curl "https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL&apiKey=YOUR_KEY"
```

### 4. Get the Response

```json
{
  "data": {
    "title": "Product Name",
    "price": 99.99,
    "description": "...",
    "images": [...],
    ...
  },
  "credits": {
    "remaining": 499,
    "used": 1
  }
}
```

## Documentation Files

| File | Description |
|------|-------------|
| `API_DOCUMENTATION.md` | Complete API reference with all endpoints, parameters, and responses |
| `API_QUICKSTART.md` | Quick start guide to get you up and running in minutes |
| `API_EXAMPLES.md` | Code examples in JavaScript, Python, PHP, Ruby, Go, Java, C#, and more |
| `openapi.yaml` | OpenAPI 3.0 specification for Swagger UI, Postman, and other tools |

## Support

Need help? We're here for you!

- 📧 **Email**: support@fetchify.app
- 💬 **Live Chat**: [fetchify.app/support](https://fetchify.app/support)
- 📚 **Documentation**: [docs.fetchify.app](https://docs.fetchify.app)
- 🐦 **Twitter**: [@fetchifyapp](https://twitter.com/fetchifyapp)
- 💼 **Discord**: [Join our community](https://discord.gg/fetchify)

## Pricing

| Package | Credits | Price | Price per 1K |
|---------|---------|-------|--------------|
| Starter | 1,000 | $50 | $50.00 |
| Pro | 10,000 | $400 | $40.00 |
| Business | 50,000 | $1,500 | $30.00 |
| Enterprise | Custom | Contact us | Custom |

[View pricing →](https://fetchify.app/pricing)

## Use Cases

### 🛍️ E-commerce
- Product catalog sync
- Inventory management
- Dropshipping automation

### 📊 Price Monitoring
- Competitor price tracking
- Dynamic pricing
- Price alerts

### 🔍 Product Research
- Market analysis
- Trend discovery
- Product discovery for affiliates

### 🤖 Automation
- Automated product imports
- Data enrichment
- Multi-channel selling

## API Status

Current API status: [status.fetchify.app](https://status.fetchify.app)

- **Uptime**: 99.9%
- **Response Time**: 2-3s average
- **Last Updated**: October 8, 2025

## Changelog

### v1.0.0 (October 2025)
- 🎉 Initial release
- ✅ Product crawl endpoint
- ✅ Credit balance endpoint
- ✅ 4 authentication methods
- ✅ Multi-language support

[View full changelog →](./CHANGELOG.md)

## Legal

- [Terms of Service](https://fetchify.app/terms)
- [Privacy Policy](https://fetchify.app/privacy)
- [API Terms](https://fetchify.app/api-terms)

---

**Ready to build something amazing?** 🚀

[Get started now →](https://fetchify.app/signup)
