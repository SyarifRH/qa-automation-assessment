# Web Testing Documentation

## Test Overview

- **Platform**: Demoblaze E-commerce
- **URL**: https://www.demoblaze.com
- **Test Type**: End-to-End Automation
- **Language**: JavaScript
- **Framework**: Playwright

## AI Tools Used

1. **ChatGPT**: Generated initial test structure
2. **DeepSeeks**: Debugging assistance

## Test Flow

1. Navigate to homepage
2. Select Phones category
3. Choose first product
4. Add to cart
5. Verify cart contents
6. Complete checkout
7. Capture order ID

## Challenges & Solutions

1. **Alert Handling**: Used page.once('dialog') to handle alerts
2. **Dynamic Elements**: Added explicit waits for cart items
3. **Order ID Extraction**: Used regex pattern matching
