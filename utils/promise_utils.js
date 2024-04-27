// ---------- UTIL FUNCTIONS ----------

// returns a promise that automatically resolves
// after a given number of milliseconds
const sleep = ms => new Promise(r => setTimeout(r, ms));

// creates a promise that can be externally resolved
const create_externally_resolvable_promise = () => {
    let res, prom = new Promise(inner_res => {
        res = inner_res;
    });
    prom.resolve = res;
    return prom;
};

// ---------- EXPORTS ----------

export {
	sleep,
	create_externally_resolvable_promise,
};
