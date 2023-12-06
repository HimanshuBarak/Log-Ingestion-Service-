
const { logQueue } = require('../../queue/queue');


async function ingestLogs(req, res){
    let log = req.body;
   
    // Parse the JSON string in the message field
    if (log.message && typeof log.message === 'string') {
      try {
          // Check if the string is in JSON format
          if (log.message.startsWith('{') && log.message.endsWith('}')) {
              const parsedMessage = JSON.parse(log.message);
              log = { ...log, ...parsedMessage };
          }
          // Otherwise, no need to parse
      } catch (error) {
          console.error("Error parsing message:", error);
          return res.status(400).send({ error: 'Invalid JSON format in message field' });
      }
  }
    // Index the log into Elasticsearch
    try {
       
        await logQueue.add('logIngestion', log);
        res.status(202).send({ message: 'Log ingestion job enqueued' });
    } catch (error) {
        console.error("Error sending log to Elasticsearch:", error);
        res.status(500).send({ error: 'Error sending log to Elasticsearch', details: error.message });
    }
}
  
module.exports.ingestLogs = ingestLogs;