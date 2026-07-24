# 💼 Job Portal

A full-stack **Job Portal Web Application** built with the **MERN Stack** that connects job seekers and recruiters. The platform allows users to browse jobs, apply by uploading resumes, and enables recruiters to manage job postings efficiently.

---

## 🚀 Features

### 👨‍💼 Job Seekers

* Browse available job listings
* View detailed job descriptions
* Apply for jobs
* Upload resumes (PDF, DOC, DOCX)
* Responsive and user-friendly interface

### 🏢 Recruiters

* Post new job openings
* Manage job listings
* View applicant information
* Secure authentication

### 🔒 Security

* JWT-based authentication
* Password hashing using Bcrypt
* Input validation
* Rate limiting
* Secure file uploads

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router DOM
* Axios
* Tailwind CSS
* Framer Motion
* React Hot Toast
* React Icons
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Express Validator
* Express Rate Limit
* CORS
* Dotenv

---

## 📂 Project Structure

```text
job/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will usually run at:

```
http://localhost:5173
```

The backend will run at:

```
http://localhost:5000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Create a `.env` file inside the **frontend** directory if required.

Example:

```env
VITE_API_URL=http://localhost:5000
```

---

## 📄 Resume Upload

Supported file formats:

* PDF
* DOC
* DOCX

Maximum upload size:

* **5 MB**

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Job Listings
* Job Details
* Login/Register
* Recruiter Dashboard
* Apply Job Page

---

## 📈 Future Improvements

* Email notifications
* Resume parsing
* Admin dashboard
* Company profiles
* Job recommendations
* Saved jobs
* Real-time notifications

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

