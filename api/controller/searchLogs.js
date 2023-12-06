const { esClient } = require('../../config/elasticClientConfig'); 



async function seachLogs(req, res) {
    //console.log("Search endpoint was called", req.body);
    // Extract parameters from request body
    const { level, message, resourceId, traceId, startDate, endDate, spanId, commit, parentResourceId } = req.body;
  
    // Construct the Elasticsearch query
    const searchQuery = {
        bool: {
            must: []
        }
    };
    // Common fields for term-based search
    const fields = { level, resourceId, traceId, spanId, commit, parentResourceId };
    // Add term-based conditions using a loop
    for (const [field, value] of Object.entries(fields)) {
        if (value) {
            searchQuery.bool.must.push({ term: { [field]: value } });
        }
    }
  
    // Special handling for message field
    if (message) {
        searchQuery.bool.must.push({ match: { message } });
    }
  
    // Range filter for date
    if (startDate && endDate) {
        searchQuery.bool.filter = {
            range: {
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            }
        };
    }
    try {
        const result = await esClient.search({
            index: 'search-logs',
            body: { query: searchQuery }
        });
        console.log("Response:", JSON.stringify(result.hits.hits, null, 2));
        res.json(result.hits.hits);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
  };

  module.exports.seachLogs = seachLogs;