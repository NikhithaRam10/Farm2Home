# Twilio SMS Notification Setup Guide

## Overview
This guide will help you integrate Twilio SMS notifications to send alerts to producers when their product quantity drops below 3 kg.

## Step 1: Install Twilio Package

Run this command in the `server` directory:

```bash
npm install twilio
```

Or add to your server `package.json` under dependencies:
```json
"twilio": "^3.99.0"
```

## Step 2: Get Twilio Credentials

1. **Sign up for Twilio**: Go to [https://www.twilio.com/console](https://www.twilio.com/console)
2. **Create a Twilio Account** (Free trial includes $15 credit)
3. **Get your credentials**:
   - `ACCOUNT_SID` - Found in your Twilio Console
   - `AUTH_TOKEN` - Found in your Twilio Console
   - `PHONE_NUMBER` - A phone number provided by Twilio (starts with +1)

## Step 3: Configure Environment Variables

Create or update your `.env` file in the `server` directory:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 4: Update User Registration to Include Phone Number

**Frontend** - Update your registration form to collect phone numbers (in `Register.jsx`):

```jsx
// Add phone field to your form
<input
  type="tel"
  placeholder="Phone number (e.g., +1234567890)"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  required
/>
```

**Backend** - Update the registration controller (`authController.js`):

```javascript
const newUser = new User({
  fullName,
  email,
  password: hashedPassword,
  role,
  phoneNumber, // Add this line
});
```

## Step 5: How It Works

### Automatic SMS Triggers:

1. **When Adding a Product** (if quantity < 3 kg):
   ```
   POST /api/products/add-product
   - If quantity is below 3 kg, SMS automatically sends to producer
   ```

2. **When Updating Product Quantity** (if quantity drops below 3 kg):
   ```
   PUT /api/products/:id
   - If new quantity is below 3 kg and no recent notification, SMS sends
   ```

### SMS Format:
```
🚨 Low Stock Alert!

Product: "Organic Tomatoes"
Current Quantity: 2 kg

Your product quantity is below 3 kg. Please restock soon!
```

## Step 6: Update Your Auth Routes (If Needed)

Make sure your registration endpoint accepts `phoneNumber`:

```javascript
// In authController.js
const register = async (req, res) => {
  const { fullName, email, password, role, phoneNumber } = req.body;
  
  // ... validation code ...
  
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
    phoneNumber, // Include this
  });
  
  await newUser.save();
  // ...
};
```

## Step 7: Test the Integration

### Using Postman or cURL:

**1. Register a Producer (with phone number):**
```bash
POST http://localhost:5000/api/auth/register
{
  "fullName": "John Farmer",
  "email": "john@farm.com",
  "password": "password123",
  "role": "producer",
  "phoneNumber": "+1234567890"
}
```

**2. Add a Product with Low Quantity:**
```bash
POST http://localhost:5000/api/products/add-product
Headers: Authorization: Bearer <token>
Body: {
  "name": "Fresh Milk",
  "pricePerKg": 50,
  "quantity": 2,
  "description": "Fresh organic milk",
  "images": [file uploads]
}
```
✅ SMS will automatically be sent to the producer's phone number!

**3. Update Product Quantity:**
```bash
PUT http://localhost:5000/api/products/:id
Headers: Authorization: Bearer <token>
Body: {
  "quantity": 2.5
}
```

## Step 8: Database Changes

Your models have been updated:
- **User Model**: Now includes `phoneNumber` field
- **Product Model**: Now tracks `notificationSent` and `lastNotificationTime` to avoid duplicate SMS

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SMS not sending | Check if `.env` has correct TWILIO credentials |
| "Invalid phone number" error | Ensure phone is in E.164 format: `+1234567890` |
| Twilio errors in console | Verify `TWILIO_ACCOUNT_SID` and `AUTH_TOKEN` are correct |
| User phone not saving | Ensure registration form sends `phoneNumber` in request |

## Optional Enhancements

### Send SMS on Order Placement
```javascript
// In orderController.js
const { sendOrderNotificationSMS } = require("../services/twilioService");

const createOrder = async (req, res) => {
  // ... create order ...
  
  // Notify producer
  const producer = await User.findById(product.createdBy);
  if (producer && producer.phoneNumber) {
    await sendOrderNotificationSMS(producer.phoneNumber, product.name, orderQuantity);
  }
};
```

### Send SMS for Order Status Updates
```javascript
// When order status changes
await sendStatusUpdateSMS(phoneNumber, orderId, newStatus);
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products/add-product` | Add product + SMS if < 3kg |
| PUT | `/api/products/:id` | Update quantity + SMS if < 3kg |
| GET | `/api/products/my-products` | Get producer's products |
| GET | `/api/products` | Get all products |

---

**Need Help?** 
- Twilio Docs: https://www.twilio.com/docs/sms
- Twilio Support: https://www.twilio.com/console/support/tickets
