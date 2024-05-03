import { strict as assert } from "assert";

// ---------- UTIL FUNCTIONS ----------

// count occurrences of key in an array
const count_occurrences = (arr, key) => {
	let c = 0;
	for (const ele of arr) {
		if (ele === key) {
			c++;
		}
	}
	return c;
};

// returns the index of the nth occurrence of a key in an array
const get_nth_occurrence_index = (arr, key, j) => {
	let c = -1;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === key) {
			c++;
		}

		if (c == j) {
			return i;
		}
	}
	assert(false);
	return -1;
};

// ---------- EXPORTS ----------

export { count_occurrences, get_nth_occurrence_index };
