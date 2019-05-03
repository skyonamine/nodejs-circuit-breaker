const baseline = 20;
let delay = baseline;
let timeErrorOcurred = null;

function delayedFunction() {
  return new Promise((resolve, reject) => {
    if (timeErrorOcurred) {
      let millisecondsPassed = new Date().getTime() - timeErrorOcurred;
      if (millisecondsPassed > 5000) {
        delay = baseline;
        timeErrorOcurred = null;
      }
    }
    if (delay > 1000) {
      timeErrorOcurred = new Date().getTime();
      return reject(new Error("Service failing"));
    }
    setTimeout(() => {
      const message = `Service is responding in ${delay} ms`;
      console.log(message);
      resolve(message);
      delay = delay * 2;
    }, delay);
  });
}

exports.delayedFunction = delayedFunction;
