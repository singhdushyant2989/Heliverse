const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

redisClient.on('error', (err) => {
  console.error(err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = redisClient;