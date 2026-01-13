const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({});

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const eventType = body.eventType || "OrderCreated";
    const orderId = body.orderId || `ord_${Date.now()}`;
    const amount = body.amount ?? 19.99;
    const customerEmail = body.customerEmail || "customer@example.com";

    const message = {
      eventType,
      version: "1",
      timestamp: new Date().toISOString(),
      data: { orderId, amount, customerEmail }
    };

    const topicArn = process.env.ORDERS_TOPIC_ARN;
    if (!topicArn) throw new Error("Missing ORDERS_TOPIC_ARN env var");

    await sns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(message),
        MessageAttributes: {
          eventType: { DataType: "String", StringValue: eventType }
        }
      })
    );

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, published: true, eventType, orderId })
    };
  } catch (err) {
    console.error("Order API error:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};
