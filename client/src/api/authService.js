import config from "src/config";

const registerUserPassword = async (email, password, userInfo) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, userInfo }),
  };
  const requestURL = config.server.api.auth.register.password.url;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  console.log(payload);

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

export { passwordAuthenticate, registerUserPassword };
