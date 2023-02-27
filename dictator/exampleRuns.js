function sleep() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function main() {
  let promise = Promise.resolve();

  for (let i = 1; i <= 25; i++) {
    promise = promise.then(() => {
      console.log(`Iteration ${i}: before sleep`);
      return sleep();
    }).then(() => {
      console.log(`Iteration ${i}: after sleep`);
    });
  }

  return promise;
}