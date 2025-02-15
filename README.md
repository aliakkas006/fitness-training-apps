# 🏋️‍♂️ Fitness Training Application

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## 📌 Table of Contents
- [📖 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Technologies Used](#-technologies-used)
- [📂 Project Structure](#-project-structure)
- [🚀 Setup & Installation](#-setup--installation)
- [🧪 Running Tests](#-running-tests)
- [📚 Resources](#-resources)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 📖 Overview
The **Fitness Training Application** is a platform that provides personalized workout plans, tracks user progress, and offers training tips to help individuals achieve their fitness goals.

### 🎯 Key Objectives:
- ✅ Enable users to create customized workout plans.
- ✅ Provide tracking features for progress monitoring.
- ✅ Allow trainers to add training tips for each workout.
- ✅ Require user authentication for personalized experiences.
- ✅ Enable profile creation to set initial fitness levels and goals.

---

## ✨ Features
🚴 Personalized workout plans  
📊 User progress tracking  
💡 Trainer tips for exercises  
🔒 Secure authentication and authorization  
👤 Profile management with fitness goal setting  
🌐 RESTful API architecture  

---

## 🛠 Technologies Used
The application is built using modern technologies and best practices:

- ⚡ **[Node.js](https://nodejs.org/):** JavaScript runtime for backend development.
- 🚀 **[Express.js](https://expressjs.com/):** Fast and minimalist web framework for Node.js.
- 🏗 **[TypeScript](https://www.typescriptlang.org/):** Enhances JavaScript with static types.
- 🗄 **[MongoDB](https://www.mongodb.com/):** NoSQL database for flexible data storage.
- 🔗 **[Mongoose](https://mongoosejs.com/):** ODM library for MongoDB and Node.js.
- 🐳 **[Docker](https://www.docker.com/):** Containerization for seamless development and deployment.
- 🧪 **[Jest](https://jestjs.io/):** JavaScript testing framework ensuring code quality.

---

## 📂 Project Structure
```
backend/
├── package.json
├── docs/                 # 📄 Documentation files
├── tests/                # 🧪 Unit & integration tests
└── src/
    ├── index.ts          # 🚀 Application entry point
    ├── app.ts            # ⚙️ Express app configuration
    ├── middleware/       # 🔐 Middleware functions
    │   ├── authenticate.ts
    │   ├── authorize.ts
    │   ├── ownership.ts
    │   ├── index.ts
    ├── routes/           # 🌍 API route handlers
    │   ├── index.ts
    │   ├── public.ts
    │   ├── private.ts
    │   ├── admin.ts
    ├── api/
    │   └── v1/
    │       ├── auth/
    │       ├── workouts/
    │       ├── progress/
    │       ├── profile/
    │       ├── user/
    │       ├── token/
    ├── lib/              # 🔧 Core business logic
    ├── models/           # 🗂 Mongoose models
    ├── utils/            # 🔨 Utility functions
```

---

## 🚀 Setup & Installation
### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/Fitness-Training-App.git
cd Fitness-Training-App
```

### 2️⃣ Install dependencies
```bash
yarn install
```

### 3️⃣ Configure environment variables
Copy `.env.example` to `.env` and update the required values.

### 4️⃣ Run the application using Docker
```bash
docker-compose up
```

---

## 🧪 Running Tests
Run unit and integration tests using Jest:
```bash
yarn test
```

---

## 📚 Resources
- 📄 **[Public API Research Docs](https://ali-akkas.notion.site/Research-on-the-public-APIs-of-Twitter-GitHub-and-Google-06f7e7f788964c2392e5b2bf741babee?pvs=4)**
- 📄 **[RESTful API Design Documentation](https://ali-akkas.notion.site/RESTful-API-Design-for-Fitness-Training-Application-13607d064ab343deb158e9d0f7e1c202?pvs=4)**
- 🎥 **[Project Presentation](https://kuacbd-my.sharepoint.com/:p:/g/personal/200934_ku_ac_bd/EYQP_vXf7uNPpex-nG1R13MByfg1rZG2ZWaYM9gKC85vxA?e=V62JhQ)**

---

## 🤝 Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

