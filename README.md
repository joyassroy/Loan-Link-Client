# 🏦 LoanLink - Micro-Finance & Loan Management System

LoanLink is a comprehensive full-stack web application designed to bridge the gap between borrowers and lenders. It streamlines the loan application process, offers real-time status tracking, and provides a robust dashboard for administrators to manage users, applications, and loan categories efficiently.

---

## 🔗 Live Links
- **Client Side Repo:** [https://github.com/joyassroy/Loan-Link-Client]
- **Server Side Repo:** [https://github.com/joyassroy/Loan-Link-Server]
- **Live Website:** [https://assignment-11-468e1.web.app/]

---



## 🚀 Key Features

### 🌟 User Experience (Frontend)
- **Modern UI/UX:** Built with React, Tailwind CSS, and DaisyUI for a clean, responsive interface.
- **Smooth Animations:** Integrated **Framer Motion** for engaging entry animations and interactions.
- **Loan EMI Calculator:** A handy tool on the home page for users to estimate monthly payments before applying.
- **Success Celebration:** **React-Confetti** animation triggers upon successful loan application submission.
- **Creative 404 Page:** A custom, interactive error page to guide lost users back home.

### 💼 Functionality (Backend & Logic)
- **Secure Authentication:** Firebase Authentication (Email/Password & Google Social Login) with JWT (JSON Web Token) verification for secure route access.
- **Role-Based Access Control (RBAC):** Distinct dashboards for **Admin**, **Manager**, and **Borrower** (User).
- **Dashboard Charts:** Visual data representation using **Recharts** to show loan statistics and application status.
- **PDF Generation:** Users can download their loan approval/payment receipts as PDF using `react-to-print`.
- **Payment Integration:** Secure payment processing via **Stripe** for loan processing fees.

---

## 🛠️ Technologies Used

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** & **DaisyUI**
- **Framer Motion** (Animations)
- **TanStack Query** (Data Fetching)
- **Axios** (API Requests)
- **SweetAlert2** (Notifications)
- **Recharts** (Data Visualization)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (Database)
- **JWT** (Authentication)
- **Stripe** (Payments)
- **Cookie Parser**

### Tools & Deployment
- **Firebase** (Auth & Hosting)
- **Vercel** (Backend & Frontend Deployment)
- **GitHub** (Version Control)

---

## 📦 NPM Packages Used
- `react-router-dom`
- `react-hook-form`
- `stripe/react-stripe-js`
- `react-confetti`
- `react-to-print`
- `localforage`
- `match-sorter`
- `sort-by`

---

## 💻 Local Installation Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
Ensure you have **Node.js** installed.

### 1. Clone the Repository
```bash
git clone https://github.com/joyassroy/Loan-Link-Client.git
cd loanlink-client
