
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });

} else {
 
    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    require('dotenv').config();
    const express = require('express');
    const bodyParser = require('body-parser');
    const routes = require("./api/routes/routerIndex")
    const cors = require('cors');
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000' // Allow only the client on port 3000
    }));

    app.use(bodyParser.json());
    app.use("/", routes);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
