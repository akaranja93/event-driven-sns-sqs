# Event Driven Microservices on AWS using SNS and SQS

This project demonstrates an event driven microservices architecture on AWS. An API Gateway endpoint accepts new orders, publishes an OrderCreated event to SNS, and fans out to multiple SQS queues. Independent Lambda services consume the queues, process events asynchronously, and handle failures using retries and dead letter queues. Logs are available in CloudWatch.

Architecture diagram: docs/architecture.md

## Services and AWS components
API Gateway for HTTP entry point  
Lambda Order API publishes events to SNS  
SNS topic fans out events to multiple consumers  
SQS queues buffer messages for each microservice  
Lambda billing worker consumes billing queue  
Lambda email worker consumes email queue  
Dead letter queues capture failed messages after retries  
CloudWatch Logs for observability  

## Why this project is valuable
It demonstrates decoupling, fanout, asynchronous processing, failure isolation, retries, and dead letter queue patterns. These are common patterns in production cloud systems and are frequently referenced in cloud engineering job descriptions.

## Repository structure
template.yaml defines the AWS resources and wiring  
src/order-api contains the SNS publisher Lambda  
src/billing-worker contains the billing consumer Lambda  
src/email-worker contains the email consumer Lambda  
docs/architecture.md contains the Mermaid diagram  

## Prerequisites
Node.js installed locally  
AWS CLI configured with aws configure  
AWS SAM CLI installed  

## Deploy
From the repository root:

sam build
sam deploy --guided

## Test the API
After deploy, get the endpoint URL:

aws cloudformation describe-stacks --stack-name event-driven-sns-sqs --query "Stacks[0].Outputs" --output table

Send a successful order:

Invoke-WebRequest `
  -Uri "PASTE_OrdersApiUrl_HERE" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    orderId = "ord_1001"
    amount = 49.99
    customerEmail = "owner@example.com"
  } | ConvertTo-Json)

## Prove DLQ behavior
Send a failing order that triggers the billing worker failure logic:

Invoke-WebRequest `
  -Uri "PASTE_OrdersApiUrl_HERE" `
  -Method POST `
  -ContentType "application/json" `
  -Body (@{
    orderId = "ord_fail_1"
    amount = 10000
    customerEmail = "owner@example.com"
  } | ConvertTo-Json)

Check billing logs:

sam logs --stack-name event-driven-sns-sqs --name BillingWorkerFunction

Check DLQ message count:

aws sqs get-queue-url --queue-name billing-dlq

aws sqs get-queue-attributes `
  --queue-url "PASTE_BillingDLQ_QueueUrl_HERE" `
  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible

## Cleanup
To avoid ongoing charges, delete the CloudFormation stack:

aws cloudformation delete-stack --stack-name event-driven-sns-sqs

You can confirm deletion in the CloudFormation console.

## Keywords
AWS, serverless, event driven architecture, microservices, SNS, SQS, Lambda, API Gateway, CloudWatch, DLQ, retries, IAM, observability
