const express = require("express");

//require cluster module
const cluster = require("cluster");
// get os to get cpu cores
const os = require("os");

const numCpu = os.cpus().length;

const app = express();

app.get("/", (req, res) => {
  for (let i = 0; i < 1e8; i++) {}
  res.send(`OK... ${process.pid}`);
});

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  //start new cluster if one fails
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(5000, () => console.log(`server ${process.pid} @ port 5000`));
}
// app.listen(5000, ()=> console.log(`server @ port 5000`))
