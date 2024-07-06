// returns a promise that automatically resolves
// after a given number of milliseconds
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// creates a promise that can be externally resolved
const createExternallyResolvablePromise = () => {
  let res,
    prom = new Promise((innerResolve) => {
      res = innerResolve;
    });
  prom.resolve = res;
  return prom;
};

export { sleep, createExternallyResolvablePromise };
