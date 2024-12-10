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

const validatePassword = (password) => {
  const minPasswordLength = 8;
  const specialCharacters = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/;
  const lowercaseLetters = /[a-z]/;
  const uppercaseLetters = /[A-Z]/;
  const numbers = /\d/;
  if (
    password.length >= minPasswordLength
    // lowercaseLetters.test(password) &&
    // uppercaseLetters.test(password) &&
    // specialCharacters.test(password) &&
    // numbers.test(password)
  ) {
    return true;
  } else return false;
};

export { generateHash, generateId, validatePassword };
