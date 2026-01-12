# Architecture

```mermaid
flowchart LR
  U[Client] -->|POST /orders| APIGW[API Gateway]
  APIGW --> OA[Lambda Order API]
  OA -->|Publish OrderCreated| SNS[SNS Topic orders topic]

  SNS -->|fanout| SQS1[SQS billing queue]
  SNS -->|fanout| SQS2[SQS email queue]

  SQS1 -->|event source mapping| BW[Lambda billing worker]
  SQS2 -->|event source mapping| EW[Lambda email worker]

  BW --> CW1[CloudWatch Logs]
  EW --> CW2[CloudWatch Logs]
  OA --> CW3[CloudWatch Logs]

  BW -->|after retries| DLQ1[Billing DLQ]
  EW -->|after retries| DLQ2[Email DLQ]
