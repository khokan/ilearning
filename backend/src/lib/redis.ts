import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const redisClient = redisUrl ? new Redis(redisUrl) : null;
