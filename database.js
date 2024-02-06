import mongoose from 'mongoose';


import {config} from 'dotenv';
config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      dbName:'test',
      useNewUrlParser:true,
      useUnifiedTopology:true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error, 'Could not connect to MongoDB');
  }
}



export default connectDB;
