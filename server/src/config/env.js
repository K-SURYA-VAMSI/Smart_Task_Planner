import dotenv from 'dotenv';

dotenv.config();

const required = (value, name) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = Object.freeze({
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  GEMINI_API_KEY: required(process.env.GEMINI_API_KEY, 'GEMINI_API_KEY'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
});


