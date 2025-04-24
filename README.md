
# 📸 LabelLens – Product Label Recognition App
![image diagram of labellenz](./public/AWS%20image%20label%20Diagram.png)

**LabelLens** is a **serverless image recognition** web application built using **AWS Rekognition**. It helps users identify product labels from uploaded images, making it perfect for **inventory management** or **cataloging** tasks. The app supports both **authenticated** and **unauthenticated** users—unauthenticated users can instantly upload and analyze images, while authenticated users can access **history tracking** for all their uploads.

---

## 🚀 Features

- **🖼 Image Upload:** Upload product images directly from the web interface.
- **🏷 AWS Rekognition Integration:** Automatically detects product labels and objects.
- **💾 DynamoDB Storage:** Stores image data, labels, and metadata for authenticated users.
- **🔐 Cognito Authentication:** Optional user authentication to enable history tracking.
- **⚡️ Serverless Architecture:** Built using AWS services to ensure scalability and cost-efficiency.

---

## 📐 Architecture Overview

The project leverages AWS **serverless** services:

- **S3 Bucket** – For storing uploaded images.  
- **API Gateway** – Acts as a bridge between the front end and backend (Lambda functions).  
- **Lambda Functions** – Handles image processing with Rekognition and database storage.  
- **AWS Rekognition** – Detects labels from uploaded images.  
- **DynamoDB** – Stores image metadata and recognition results.  
- **Cognito** – Manages user authentication (sign-in/sign-up).  
- **Amplify** – Hosts and manages the front end.

---

## 🛠 Tech Stack

- **Frontend:** React.js (using AWS Amplify & Amplify UI components)  
- **Backend:** AWS Lambda (Node.js 20.x runtime)  
- **Authentication:** AWS Cognito  
- **Storage:** Amazon S3 & DynamoDB  
- **Image Recognition:** AWS Rekognition  
- **Hosting:** AWS Amplify Hosting  
- **API Gateway:** REST API for Lambda integration  

---

## ⚙️ Setup Guide

Follow these steps to replicate or deploy **LabelLens**:

---

### 1️⃣ AWS S3 – **Image Storage**

1. **Create an S3 Bucket** named:  
   `image-rekognition-bucket*****-dev`
2. Enable **public access** for uploaded files.
3. Define two folders inside the bucket:  
   - `/uploads/unath` – For uploaded images  
   - `/uploads/auth` – (optional) For auth users

4. Add the following **S3 bucket policy** to allow Lambda to access images:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaS3Access",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "<bucketName/>"
    }
  ]
}
