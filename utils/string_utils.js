// ---------- UTIL FUNCTIONS ----------

// normalize string, remove colour codes and all other ansi codes
const ansi_normalize = (str) => {
	const normalized_str = str.replace(
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
	return normalized_str;
};

// tokenizes a string
const tokenize = (str) => {
	// split on punctuation and symbols while preserving them
	// and split on whitespaces without preservation
	// the regex matches whitespaces or noncapturing punctuation
	// after or before with optional whitespaces around them
	return str.split(/\s+|(?:\s*(?:(?<=[^\s\w])|(?=[^\s\w]))\s*)/);
};

// ---------- EXPORTS ----------

export {
	ansi_normalize,
	tokenize,
};
