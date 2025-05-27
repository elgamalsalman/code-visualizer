import config from "src/config";

import { methods, query } from "../utils";

const registerPassword = async (email, password, name) => {
  return await query(methods.post, "/auth/register/password", {
    email,
    password,
    userInfo: { name },
  });
};

const loginPassword = async (email, password) => {
  return await query(methods.post, "/auth/login/password", {
    email,
    password,
  });
};

const loginNyu = async () => {};

const requestEmailVerification = async (email) => {
  return await query(methods.post, "/auth/email-verification/send", null, {
    email,
  });
};

const verifyEmail = async (token) => {
  return await query(methods.post, "/auth/email-verification/verify", null, {
    token,
  });
};

const requestPasswordReset = async (email) => {
  return await query(methods.post, "/auth/password-reset/send", null, {
    email,
  });
};

const resetPassword = async (token, password) => {
  return await query(
    methods.post,
    "/auth/password-reset/reset",
    { password },
    {
      token,
    },
  );
};

const authApi = {
  register: {
    password: registerPassword,
  },
  login: {
    password: loginPassword,
    nyu: loginNyu,
  },
  emailVerification: {
    request: requestEmailVerification,
    verify: verifyEmail,
  },
  passwordReset: {
    request: requestPasswordReset,
    reset: resetPassword,
  },
};

export default authApi;
