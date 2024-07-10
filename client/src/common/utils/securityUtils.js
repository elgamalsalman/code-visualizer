const generateHash = (hashLength = 8) => {
  let charset = "";
  let hash = "";

  charset += "0123456789";
  charset += "abcdefghijklmnopqrstuvwxyz";
  charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < hashLength; i++) {
    hash += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return hash;
};

const generateId = (() => {
  let counter = -1;
  return () => {
    counter++;
    return counter;
  };
})();

export { generateHash, generateId };
