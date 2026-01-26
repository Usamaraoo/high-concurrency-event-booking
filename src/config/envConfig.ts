import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    port: number;
  }
  seed: {
    user: {
      username: string;
      email: string;
    }
  }
  database: {
    username: string;
    password: string;
    host: string;
    port: number;
    dbName: string;
  }
  redis: {
    host: string;
  }
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}


const envConfig: Config = {
  server: {
    port: Number(getEnvVar('PORT')) || 3000,
  },
  database: {
    username: getEnvVar('DB_USERNAME'),
    password: getEnvVar('DB_PASSWORD'),
    host: getEnvVar('DB_HOST'),
    port: Number(getEnvVar('DB_PORT')),
    dbName: getEnvVar('DB_NAME'),
  },
  redis: {
    host: getEnvVar('REDIS_HOST'),
  },
  seed:{
    user:{
      username: getEnvVar('SEED_USERNAME'),
      email: getEnvVar('SEED_USER_EMAIL'),
    }
  }
};

export default envConfig;