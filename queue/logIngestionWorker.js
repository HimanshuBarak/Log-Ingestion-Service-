const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { esClient } = require('../config/elasticClientConfig'); 

const connection = new IORedis();

const worker = new Worker('logIngestionQueue', async job => {
    // Process the log ingestion job
    try {
        
        await esClient.index({
            index: 'search-logs', // Elasticsearch index
            body: job.data // The log data from the job
        });
       console.log(`Log ingested for job ${job.id}`)
        
    } catch (error) {
        console.error(`Error ingesting log for job ${job.id}:`, error);
    }
}, { connection });
