const { Queue} = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis(); // Configure this for your Redis server

// Create a queue for log ingestion
const logQueue = new Queue('logIngestionQueue', { connection });


module.exports = { logQueue };


