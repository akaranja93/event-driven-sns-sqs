exports.handler = async (event) => {
  for (const record of event.Records || []) {
    const payload = JSON.parse(record.body);
    const message = payload.Message ? JSON.parse(payload.Message) : payload;

    const { orderId, amount } = message.data || {};
    console.log(
      JSON.stringify({
        service: "billing",
        action: "charge",
        orderId,
        amount,
        receivedAt: new Date().toISOString()
      })
    );

    if (amount > 9999) {
      throw new Error("Billing simulated failure for large amount");
    }
  }
  return { ok: true };
};
