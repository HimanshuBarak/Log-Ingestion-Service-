const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const esClient = new Client({
    node: process.env.ELASTIC_CLUSTER_ENDPOINT,
    auth: {
      apiKey: process.env.ELASTICSEARCH_API_KEY,
    },
});

module.exports = esClient;
