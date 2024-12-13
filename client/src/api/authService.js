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
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  // console.log(payload);

  return payload;
};

const requestEmailVerification = async (email) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  };
  const requestURL = config.server.api.auth.email_verification.send.url;
  console.log(requestURL);
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

const verifyEmail = async (token) => {
  console.log("verifying");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const requestURL = `${config.server.api.auth.email_verification.verify.url}/${token}`;
  console.log(requestURL);
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

  return payload;
};

export {
  passwordAuthenticate,
  registerUserPassword,
  requestEmailVerification,
  verifyEmail,
};
