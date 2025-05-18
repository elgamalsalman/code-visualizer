import config from "src/config";

const registerUserPassword = async (email, password, name) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, userInfo: { name } }),
  };
  const requestURL = config.server.api.auth.register.password.url;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  // console.log(payload);

  return payload;
};

const passwordAuthenticate = async (email, password) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };
  const requestURL = config.server.api.auth.login.password.url;
  console.log(requestURL);
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  // console.log(payload);

  return payload;
};

const nyuAuthenticate = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ email, password }),
  };
  const requestURL = config.server.api.auth.login.nyu.url;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

const requestEmailVerificationEmail = async (email) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  };
  const requestURL = config.server.api.auth.email_verification.send.url;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

const verifyEmail = async (token) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const requestURL = `${config.server.api.auth.email_verification.verify.url}/${token}`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

const requestPasswordResetEmail = async (email) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  };
  const requestURL = config.server.api.auth.password_reset.send.url;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

const resetPassword = async (token, password) => {
  console.log("verifying");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  };
  const requestURL = `${config.server.api.auth.password_reset.reset.url}/${token}`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

export {
  registerUserPassword,
  passwordAuthenticate,
  nyuAuthenticate,
  requestEmailVerificationEmail,
  verifyEmail,
  requestPasswordResetEmail,
  resetPassword,
};
