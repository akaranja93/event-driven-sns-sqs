exports.handler = async (event) => {
  for (const record of event.Records || []) {
    const payload = JSON.parse(record.body);
    const message = payload.Message ? JSON.parse(payload.Message) : payload;

    const { orderId, customerEmail } = message.data || {};
    console.log(
      JSON.stringify({
        service: "email",
        action: "send_confirmation",
        orderId,
        customerEmail,
        receivedAt: new Date().toISOString()
      })
    );
  }
  return { ok: true };
};
