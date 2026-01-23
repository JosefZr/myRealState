# 🏡 Full-Stack Real Estate Website

A full-stack real estate web application built with **Node.js, Express, Prisma, MongoDB, and React (Vite)**.

---

## 📁 Project Structure

full-stack-estate/
│
├── api/ # Backend (Node.js + Express + Prisma)
├── client/ # Frontend (React + Vite)
├── socket/ # socket
├── README.md


---

## ⚙️ Requirements

- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account

---

## 🔐 Environment Variables

Create a `.env` file inside the **api** folder:

api/.env

Add the following:

DATABASE_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

Example:

DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/realestate
JWT_SECRET_KEY=mySecretKey
CLIENT_URL=http://localhost:5173


⚠️ Do NOT commit your `.env` file.

---

## 🚀 How to Run the Project

### 1️⃣ Install dependencies

Backend:
cd api
npm install


Frontend:
cd ../client
npm install


---

### 2️⃣ Run the application

Backend:
cd api
npm run dev

Frontend:
cd client
npm run dev

socket:
cd socket
npm run dev


---

### 3️⃣ Open in browser

http://localhost:5173


---

## 🧠 Prisma Setup
After setting the `DATABASE_URL`:

cd api
npx prisma generate

(Optional)
npx prisma studio


---

## 🛡️ Notes

- Make sure MongoDB Atlas allows your IP address
- Restart the backend after changing `.env`
- Do not expose secrets in public repositories

---

## 📌 Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB Atlas
- ORM: Prisma
- Auth: JWT

---

## 📄 License
For learning and development purposes.
