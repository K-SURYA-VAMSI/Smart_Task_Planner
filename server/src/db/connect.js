import mongoose from 'mongoose';

export async function connectToDatabase(mongodbUri) {
  if (mongoose.connection.readyState === 1) return;

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongodbUri, {
    serverSelectionTimeoutMS: 10000,
  });
}


