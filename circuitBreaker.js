const Brakes = require("Brakes");
const { delayedFunction } = require("./delayedFunction");

function circuitBreaker() {
  const brake = new Brakes(delayedFunction, {
    statInterval: 25000,
    threshold: 0.5,
    circuitDuration: 40000,
    timeout: 1000
  });

  brake.on("snapshot", snapshot => {
    console.log(
      "Running at:",
      snapshot.stats.successful / snapshot.stats.total
    );
    console.log(snapshot);
  });

  function fallbackCall(foo) {
    return new Promise((resolve, reject) => {
      resolve("I always succeed");
    });
  }

  function healthCheckCall(foo) {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.8) {
        resolve("Health check success");
      } else {
        reject("Health check failed");
      }
    });
  }

  brake.fallback(fallbackCall);

  brake.on("circuitOpen", () => {
    console.log("----------Circuit Opened--------------");
  });

  brake.healthCheck(healthCheckCall);

  brake.on("circuitClosed", () => {
    console.log("----------Circuit Closed--------------");
  });

  return brake;
}
exports.circuitBreaker = circuitBreaker;
