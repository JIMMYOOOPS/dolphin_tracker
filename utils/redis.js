const redis = require('redis');
const {redisConfig} = require('./config');

const redisClient = redis.createClient(redisConfig);

redisClient.ready = false;

redisClient.on('ready', () => {
  redisClient.ready = true;
  console.log('Redis is ready');
});

redisClient.on('error', (err) => {
  redisClient.ready = false;
  console.log('Error in Redis', err);
});

redisClient.on('end', () => {
  redisClient.ready = false;
  console.log('Redis is disconnected');
});

// Test Connection
// (async ()=> {
//     await redisClient.connect();
// })()


module.exports = {
  redisClient,
};
