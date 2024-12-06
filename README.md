# Talx-Backend 🚀

**Visit Talx**: [https://talx.vercel.app/](https://talx.vercel.app/) 

**Talx-Backend** is the backend API for the **Job Portal** on the Talx Website. It provides job management, authentication, subscription, news integration, contact functionalities, and job application handling. The backend is built using **Node.js** and **Express.js** with a MongoDB database.

---

## Features ✨
- **Job Management**: Post, update, delete, and fetch jobs. 💼
- **Email Subscription**: Subscribe users to daily job updates 📧.
- **Authentication**: JWT-based secure login and signup 🔐.
- **News Integration**: Fetch news articles using the News API 📰.
- **Contact Form**: Integrates Google Sheets for storing contact form submissions 📑.
- **Job Applications**: Submit and manage job applications, including file uploads for resumes 📄.
- **Keep-Alive Mechanism**: Ensures the server stays active using cron jobs 🕒.

---

## Prerequisites 🛠️
Ensure you have the following installed:
1. [Node.js](https://nodejs.org/) (v16+ recommended) 💻
2. [npm](https://www.npmjs.com/) 🛒
3. MongoDB (local or cloud setup, e.g., MongoDB Atlas) 🗃️

---

## Setup Instructions ⚙️

### 1. Clone the Repository
```bash
git clone https://github.com/aakashdixit22/talx-backend.git
cd talx-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a `.env` File
Create a `.env` file in the root directory with the following variables:

```plaintext
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_password>
BACKEND_URL=<your_backend_url>
JWT_SECRET=<your_jwt_secret>
NEWS_API_KEY=<your_news_api_key>
MONGODB_URI=<your_mongodb_uri>
SPREADSHEET_ID=<your_google_sheet_id>
TYPE=service_account
PROJECT_ID=<your_google_project_id>
PRIVATE_KEY_ID=<your_private_key_id>
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
CLIENT_EMAIL=<your_google_client_email>
CLIENT_ID=<your_google_client_id>
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_X509_CERT_URL=<your_google_client_cert_url>
```

**⚠️ Important**: Do not hard-code credentials or sensitive information in your code. Use `.env` files and keep them secure.

### 4. Run the Server
Start the server locally:
```bash
node app.js
```

---

## API Endpoints 🔌

### General 🌐
- **GET** `/`  
  Default route. Responds with a welcome message. 👋
- **GET** `/api/keepalive`  
  Keep-alive route to prevent the server from sleeping. 💤

---

### Jobs (`/api/jobs`) 💼
- **POST** `/post-job`  
  Create a new job. This requires authentication. ✍️
  
- **GET** `/all-jobs`  
  Fetch all jobs available in the portal. 🧐

- **GET** `/myJobs/:email`  
  Fetch all jobs posted by a specific user (requires authentication). 📬

- **DELETE** `/delete-job/:jobId`  
  Delete a job by its ID (requires authentication). 🗑️

- **PUT** `/edit-job/:jobId`  
  Edit a job by its ID (requires authentication). ✏️

---

### Email Subscriptions (`/api/subscribers`) 📧
- **POST** `/subscribe`  
  Subscribe an email for updates. 🔔

---

### Authentication (`/api/auth`) 🔐
- **POST** `/signin`  
  Login using email and password. 💼  
- **POST** `/signupr`  
  Register a new user. 📝

---

### Job Applications (`/api/jobApply`) 📄
- **POST** `/apply/:jobId`  
  Submit a job application for a specific job. This route accepts a file upload (`resume`) and form fields (`name`, `email`, `phone`, and `coverLetter`). 📝💼

- **GET** `/my-applications/:email`  
  Fetch all job applications submitted by a user, identified by their email address. The response includes job details for each application. 📂

- **GET** `/applicants/:jobId`  
  Retrieve all applications for a specific job. Requires authentication. 📑

---

### News (`/api/news`) 📰
- **GET** `/news`  
  Fetch news articles (supports query and category filters). 📜

---

### Contact Form (`/api/contact`) 📑
- **POST** `/submit`  
  Submit a contact form entry. The data is stored in a Google Sheet. 🖋️

---

## Technologies Used 🧰
- **Node.js**: Backend runtime. 💻
- **Express.js**: Web framework. ⚙️
- **MongoDB**: Database. 🗃️
- **Mongoose**: ODM for MongoDB. 🐱
- **Cron**: Keep-alive job scheduling. ⏰
- **Axios**: HTTP requests. 🌐
- **Multer**: File uploads handling. 📤
- **Nodemailer**: Email handling. 📧
- **Google Sheets API**: For contact form storage. 📝

---


## 🔗 Related Repositories  

1. **Talx Frontend (Main Platform)**  
   - [talx-frontend](https://github.com/aakashdixit22/talx-frontend)  

2. **Talx AI Backend**  
   - [talx-backend](https://github.com/aakashdixit22/talx-api)  

---

## License 📝
This project is licensed under the [MIT License](https://github.com/aakashdixit22/talx-backend/blob/main/LICENSE).
