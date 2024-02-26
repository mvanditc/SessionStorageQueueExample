const express = require('express');
const app = express();
const port = 3022;

const bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());

let queue = []

app.get('/', (req, res) => {
    res.send("Welcome to the Backend");
});

app.get('/get-latest-queue', (req, res) => {
    res.send(queue);
});

app.get('/join-queue', (req, res) => {
    try{
        let newQueuePosition = "person-" + (Date.now()).toString()
        queue.push(newQueuePosition)
        res.send({
            "status": "success",
            "position": newQueuePosition
        });
    }catch{
        res.send({"status": "fail"});
    }
});

app.get('/add-to-queue', (req, res) => {
    try{
        queue.push("robot-" + (Date.now()).toString())
        res.send({"status": "success"});
    }catch{
        res.send({"status": "fail"});
    }
});

app.get('/pop-from-queue', (req, res) => {
    try{
        let poppedFromQueue = queue.shift()
        res.send({
            "status": "success",
            "nextUp": poppedFromQueue
        });
    }catch{
        res.send({"status": "fail"});
    }
});

app.put('/leave-queue', (req, res) => {
    const requestData = req.body;

    let attemptedPosition = requestData["position"]

    try{
        let indexToRemove = queue.indexOf(attemptedPosition);

        if (indexToRemove !== -1) {
            queue.splice(indexToRemove, 1);
            res.send({"status": "success"});
        }else{
            res.send({"status": "fail"});
        }
    }catch{
        res.send({"status": "fail"});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});