import { createClient } from 'redis';
import envConfig from '../../config/envConfig';

export const redisClient = createClient({
  url: envConfig.redis.host,
});

redisClient.on('error', (err) => {
  console.error('Redis error', err);
});
