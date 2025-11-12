# 🧾 DBDoc – Full-Stack Booking App (React + Node.js)

**DBDoc** is a full-stack **local repair shop booking system**, built with a modern architecture featuring a **React/Next.js frontend** and a **Node.js backend** using **MariaDB/MySQL**.  
It’s designed for **local or internal network use**, giving small businesses an easy-to-deploy booking solution without relying on the cloud.

---

## 📦 Tech Stack Overview

| Layer | Tech Stack | Purpose |
|-------|-------------|----------|
| **Frontend** | Next.js (React) + Tailwind CSS | Customer-facing booking UI |
| **Backend** | Node.js + Express + MySQL2 | Handles form submissions, DB logic, and emails |
| **Database** | MariaDB / MySQL | Stores jobs, customer details, and booking data |

---

## ✨ Features

- 📋 Clean booking form with auto-save (persists unfinished input)
- 🔢 Automatically reserves the next **Job ID** before submission
- 📧 Sends confirmation emails including job reference
- 🔐 Optional SSL support for secure DB connections
- 🧠 Smart customer linking (detects returning customers)
- 🖥️ Fully local — no external APIs or cloud dependencies

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Before you begin, make sure the following are installed:

- **Node.js** ≥ 18  
- **MariaDB** or **MySQL** (running locally or on your LAN)  
- *(Optional)* **Python** — only needed for the full DBDoc technician GUI

---

### 2️⃣ Install Dependencies

From the project root directory, run:

```bash
npm install
```

### 3️⃣ Run the Setup Wizard

The setup wizard will:

- Create `.env` files for **frontend** and **backend**
- Ask for your **business name**, **API URL**, and **database credentials**
- (Optionally) **create your database and tables** using the included `template.sql`

Run it with:

```bash
npm run setup
```

### 4️⃣ Start the dev servers

run:
```bash
npm run dev
```