# MailTales

## Make emails fun again!

MailTales is a web app designed to breathe life into your email inbox. With the help of **Nylas** & AI, MailTales offers unique and creative ways to interact with your emails, transforming them into bite-sized stories, engaging summaries, and even providing insights through sentiment analysis. You can try it [https://mailtales.amitwani.dev](https://mailtales.amitwani.dev)

## Demo

Youtube - [https://youtu.be/zk88KqHMCR0](https://youtu.be/zk88KqHMCR0)

## Features

**Chat Over Your Inbox**: With MailTales, you can chat with your email inbox!

![chat-over-emails](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0pl9tbbdi70lidxwthsd.png)

**AI-Powered Email Summaries**: MailTales provides concise, AI-generated summaries of your emails

![ai-summary](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/au67ahoawtfe8ig4kpdh.png)

**Listen to AI-Generated Stories**: MailTales can convert the content of your emails into engaging audio stories.

![ai-story](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sm4ufaabt6j2ctrnt8pt.png)

**Sentiment Analysis and Categorization**: MailTales' sentiment analysis feature helps you understand the tone of your messages. The app also categorizes emails based on their content.

![sentiment](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yjrfywjchv34ju53yrbg.png)

## Tech Stack

**Full Stack:** NextJS
**Backend:** NodeJS
**Deployment:** Vercel, Fly.io
**Database:** PostgreSQL
**Queues:** Upstash Kafka
**Email:** Nylas
**AI:** Gemini

### Architecture

![
![mail-tales-architecture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/djz8c5hbsmbhpu7l6qiu.png)](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ps5xsiflumii7m7arvjq.png)


**Nylas:** Nylas is used for authentication of user and fetching their emails from inbox

**Gemini:** Gemini is used for generating AI responses as well as generating embeddings. Model used for generating responses is `gemini-1.5-flash` and for embeddings it is `text-embedding-004`

**Postgres:** Postgres is used to store user and emails data. `@vercel/postgres` is used for this.

**Upstash Kafka:** Upstash Kafka is used for the job of generating email embeddings. Generating email embeddings is done by a NodeJS Backend by consuming messages from Upstash Kafka topic.
