const express = require('express');
const router = express.Router();

const { ingestLogs } = require("../controller/ingestLogs");
const { seachLogs  } = require('../controller/searchLogs');


router.post("/ingest", ingestLogs);
router.post("/search", seachLogs);


module.exports = router