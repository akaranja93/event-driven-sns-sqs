## Subscription filtering
SNS subscription filtering is enabled using MessageAttributes to control event routing.

Each published event includes an `eventType` message attribute.  
SNS subscriptions apply filter policies so that each service receives only the events it needs.

Billing subscription:
- Receives OrderCreated events only

Email subscription:
- Receives OrderCreated and OrderCancelled events

This reduces unnecessary processing, improves scalability, and keeps services loosely coupled.
Filtering behavior was verified using CloudWatch Logs to confirm correct event delivery.


