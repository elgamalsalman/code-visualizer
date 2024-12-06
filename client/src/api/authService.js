import config from "src/config";

const passwordAuthenticate = async (email, password) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };
  const requestURL = `${config.server.api.auth.url}/password`;
  const response = await fetch(requestURL, requestOptions);
  const payload = await response.json();

  // console.log(payload);

  return payload;
};

export { passwordAuthenticate };
