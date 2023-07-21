/* import mongoose from 'mongoose';

const connectDB = (connectionStr: string) => {
  return mongoose.connect(connectionStr);
};

export default connectDB; */

/* 
import fs from 'fs/promises';
import path from 'path';

interface DB {
  users: Array<object>;
  workoutsPlan: Array<object>;
  progressTracking: Array<object>;
  profiles: Array<object>;
}

class DBconnection {
  db: DB;
  constructor(public dbURL: string) {
    this.db = {
      users: [],
      workoutsPlan: [],
      progressTracking: [],
      profiles: [],
    };
    this.dbURL = dbURL;
  }

  async read() {
    const dbStr = await fs.readFile(this.dbURL, { encoding: 'utf-8' });
    this.db = JSON.parse(dbStr);
  }

  async write() {
    if (this.db) await fs.writeFile(this.dbURL, JSON.stringify(this.db));
  }

  async getDB() {
    if (this.db) return this.db;
    await this.read();
    return this.db;
  }
}

const connection = new DBconnection(path.resolve(process.env.DB_URL as string));

export default connection;
 */
