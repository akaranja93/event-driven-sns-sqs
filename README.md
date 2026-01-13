## Subscription filtering
SNS subscription filtering is enabled using MessageAttributes.

Billing subscription filter:
eventType = OrderCreated

Email subscription filter:
eventType = OrderCreated, OrderCancelled

This ensures each microservice receives only the events it needs, reducing unnecessary processing and improving scalability.
