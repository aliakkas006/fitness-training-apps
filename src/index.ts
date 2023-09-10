import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from './db';
import logger from './config/logger';

const server: http.Server = http.createServer(app);
const port = process.env.PORT || 4000;

const main = async () => {
  try {
    // database connection
    await connectDB();

    // server connection
    server.listen(port, async () => {
      logger.info(`Express server is listening at http://localhost:${port}`);
    });
  } catch (err: any) {
    logger.error('Database error ->', err.message);
  }
};

main();

// data create and save to DB
// const user = new User({
//   name: 'Ali Akkas',
//   email: 'ali@gmail.com',
//   password: 'Aa1$kka',
//   role: 'admin',
// });

// await user.save();
// console.log('User Created!');

// const workoutPlan = new WorkoutPlan({
//   name: 'Heavy DT',
//   mode: '5 Rounds For Time',
//   equipment: ['barbell', 'rope'],
//   exercises: ['9 deadlifts', '5 hang power cleans', '4 push jerks'],
//   trainerTips: [
//     'Aim for unbroken push jerks',
//     'The first three rounds might feel terrible, but stick to it',
//     'RX Weights - 205lb/145lb',
//   ],
//   photo: 'https://s3.aws.com/my-fitness/img.jpg',
//   builder: {
//     id: 101,
//     name: 'Ali Akkas',
//   },
// });

// await workoutPlan.save();
