[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Fitness-Traninig-Apps

## [Public API Research Docs](https://ali-akkas.notion.site/Research-on-the-public-APIs-of-Twitter-GitHub-and-Google-06f7e7f788964c2392e5b2bf741babee?pvs=4)

## [RESTful API Design for Fitness Training Application](https://ali-akkas.notion.site/RESTful-API-Design-for-Fitness-Training-Application-13607d064ab343deb158e9d0f7e1c202?pvs=4)

## [Presentation based on this project](https://kuacbd-my.sharepoint.com/:p:/g/personal/200934_ku_ac_bd/EYQP_vXf7uNPpex-nG1R13MByfg1rZG2ZWaYM9gKC85vxA?e=V62JhQ)

## Overview
- Develop a fitness training application that provides personalized workout plans.​
- Tracking progress features to help individuals to achieve their fitness goals.​
- A trainer can add some important training tips for each workout.​
- Users must be logged in to their account in order to create personalized workout plans and track their progress over time.​
- Users can create their own profile and set their initial fitness level and goal.​
- The goal is to create a comprehensive fitness tool that motivates and guides users through their fitness journey.​

## Technologies Used

- [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Typescript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types to the language
- [MongoDB](https://www.postgresql.org/) - MongoDB is an open-source document database built on a horizontal scale-out architecture that uses a flexible schema for storing data.
- [Mongoose](https://mongoosejs.com/) - Mongoose is a JavaScript object-oriented programming library that creates a connection between MongoDB and the Node.js JavaScript runtime environment.
- [Docker](https://www.docker.com/) - Docker is a platform designed to help developers build, share, and run container applications.
- [Jest](https://jestjs.io/) - Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase.

## Backend File Structure

```
backend/

├── package.json
├── docs/
├── tests
└── src/
        ├── index.ts       // boot file
        ├── app.ts         // express app root file
        ├── middleware/
            └── authenticate.ts
            └── authorize.ts
            └── ownership.ts
            └── index.ts
        ├── routes/
        │   ├── index.ts
        │   ├── public.ts
        │   ├── private.ts
        │   ├── admin.ts
        ├── api/
        │   └── v1/
        │       ├── auth/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
                ├── workouts/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
                ├── progress/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
                ├── profile/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
                ├── user/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
                ├── token/
        │       │   ├── index.ts
        │       │   ├── controllers.ts
        ├── lib/
        │   ├── auth/
        │   │   ├── index.ts
        │   └── workout/
        │       ├── index.ts
        │       ├── progress/
        │       │   ├── index.ts
        │       ├── profile/
        │       │   ├── index.ts
        │       ├── user/
        │       │   ├── index.ts
        │       ├── token/
        │       │   ├── index.ts
        ├── model/
        │   ├── WorkoutPlan.ts
        │   ├── Progress.ts
            ├── Profile.ts
            ├── User.ts
            ├── Token.ts
        └── utils
```

## Setup
follow .env.example file for setup environment variables

### Run the `MongoDB server` with `Mongo-express`
```bash
docker-compose up -d
```

### Run the `application server`
```bash
yarn run dev
```

### Run the `Tests`
```
yarn run test .\tests\**\**\*
```


