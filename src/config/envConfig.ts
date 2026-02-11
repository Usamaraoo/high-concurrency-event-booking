import dotenv from 'dotenv';

dotenv.config();

interface Config {
  server: {
    env: string;
    port: number;
    base_url: string;
    jwt_secret: string;
    salt_round: number
  }
  stripe: {
    secret_key: string;
    webhook_secret: string;
  }
  seed: {
    user: {
      username: string;
      email: string;
      password: string;
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
    env: getEnvVar('NODE_ENV'),
    base_url: getEnvVar('BASE_URL'),
    port: Number(getEnvVar('PORT')) || 3000,
    jwt_secret: getEnvVar('JWT_SECRET'),
    salt_round: Number(getEnvVar('SALT_ROUND'))
  },
  stripe: {
    secret_key: getEnvVar('STRIPE_SECRET'),
    webhook_secret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
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
  seed: {
    user: {
      username: getEnvVar('SEED_USERNAME'),
      email: getEnvVar('SEED_USER_EMAIL'),
      password: getEnvVar('SEED_USER_PASSWORD'),
    }
  }
};

export default envConfig;