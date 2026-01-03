const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendLowStockSMS = async (phoneNumber, productName, currentQuantity) => {
  try {
    if (!phoneNumber) {
      console.warn("No phone number provided for SMS notification");
      return false;
    }

    const message = await client.messages.create({
      body: `🚨 Low Stock Alert!

Product: "${productName}"
Current Quantity: ${currentQuantity} kg

Please restock soon!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✅ SMS sent: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    return false;
  }
};

const sendOrderNotificationSMS = async (
  phoneNumber,
  productName,
  quantity
) => {
  try {
    if (!phoneNumber) return false;

    await client.messages.create({
      body: `📦 New Order!

Product: "${productName}"
Quantity Ordered: ${quantity} kg`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return true;
  } catch (error) {
    console.error("❌ Order SMS error:", error.message);
    return false;
  }
};

module.exports = { sendLowStockSMS, sendOrderNotificationSMS };
