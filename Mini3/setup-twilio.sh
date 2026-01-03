#!/bin/bash

# Twilio SMS Integration Quick Start

echo "📱 Twilio SMS Integration Setup"
echo "================================"
echo ""

# Step 1: Install Twilio
echo "📦 Installing Twilio package..."
cd server
npm install twilio

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://www.twilio.com/console to get your credentials"
echo "2. Create a .env file in the server directory with:"
echo ""
echo "   TWILIO_ACCOUNT_SID=your_account_sid"
echo "   TWILIO_AUTH_TOKEN=your_auth_token"
echo "   TWILIO_PHONE_NUMBER=+your_twilio_phone"
echo ""
echo "3. Update your User Registration to include phoneNumber field"
echo "4. Test by adding a product with quantity < 3 kg"
echo ""
echo "📖 See TWILIO_SMS_SETUP.md for detailed documentation"
