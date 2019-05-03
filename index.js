const { circuitBreaker } = require("./circuitBreaker");

const { opossumCircuitBreaker } = require("./opossumCircuitBreaker");


const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const circuit = circuitBreaker();
const opossumCircuit = opossumCircuitBreaker();

app.get('/opossum', (request, response) => {
    opossumCircuit.fire().then(result => {
        response.send(result);
    }).catch(err => {
        response.send(err.message);
    });
});

app.use('/', (request, response) => {
    circuit.exec().then(result => {
        response.send(result);
    }).catch(err => {
        response.send(err.message);
    });
});

app.listen(3000, () => console.log("Listening to port 3000 (http://localhost:3000)"));
