const validateEmail = (email) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

const validateNYUEmail = (email) => {
  return /^[A-Z0-9._%+-]+@nyu\.edu$/i.test(email);
};

export { validateEmail, validateNYUEmail };
