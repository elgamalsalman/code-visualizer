import React, { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./Login.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { validateEmail } from "src/common/utils/emailUtils";
import {
  authMethods,
  SideCanvas,
  EmailField,
  PasswordField,
  useAuthMethod,
} from "./shared";
import { FormButton, FormOrDivider } from "src/common/components/Form";
import { nyuAuthenticate, passwordAuthenticate } from "src/api/authService";
import useAlerter from "src/hooks/useAlerter";
import useUser from "src/hooks/useUser";

function Login() {
  // alerter
  const [_, alerter] = useAlerter();

  // url redirecting
  const navigate = useNavigate();

  // form data states
  const [email, setEmail] = useState("");
  const authMethod = useAuthMethod(email);

  const [password, setPassword] = useState("");
  const passwordActive = useMemo(() => {
    return authMethod.name === authMethods.password.name;
  }, [authMethod]);

  // validate plausable credentials
  const credentialsValid = useMemo(() => {
    // universal checks
    if (!validateEmail(email)) return false;
    if (password === "") return false;
  }, [email, password]);

  // auth user information
  const [__, updateUser] = useUser();
  const logUserIn = useCallback(
    (user) => {
      // update app-wide user information
      updateUser((_) => {
        return user;
      });
      navigate("/projects/home"); // TODO: this redirects to nothing
    },
    [navigate, updateUser],
  );

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Login"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}>
          <div>Login to Your</div>
          <div>CodeVisualizer Account!</div>
        </div>

        <div className={styles["form-main-body"]}>
          <div className={styles["internal-registration"]}>
            <EmailField state={email} stateSetter={setEmail} />
            <PasswordField
              active={passwordActive}
              title={"password"}
              state={password}
              stateSetter={setPassword}
              error={null}
            />

            <FormButton
              cta={true}
              active={credentialsValid}
              icon={authMethod.activeIcon}
              inactiveIcon={authMethod.inactiveIcon}
              text={
                authMethod.name === authMethods.password.name
                  ? "Login!"
                  : "Login with NYU"
              }
              onClick={async () => {
                let user = null;
                let error = null;
                if (authMethod.name === authMethods.password.name) {
                  const result = await passwordAuthenticate(email, password);
                  if (result.error) {
                    error = result.error;
                  } else {
                    user = result;
                  }
                } else if (authMethod.name === authMethods.nyu.name) {
                  // TODO: nyu authentiation
                  const result = await nyuAuthenticate();
                  console.log(result);
                } else {
                  console.log("unkown authentication type!");
                }

                // if found a user successfully log them in
                if (user) logUserIn(user);
                // else alert error and create
                else {
                  setPassword(""); // reset password field in case it was used
                  alerter.create("error", error || "Error Logging In"); // alert
                }
              }}
            />

            <div
              className={clsx(
                globalStyles["link"],
                styles["forgot-password-link"],
              )}
              onClick={() => {
                navigate("/auth/password-reset/send", {
                  state: { email },
                });
              }}
            >
              Forgot Password?
            </div>
          </div>

          <FormOrDivider />

          <div className={styles["external-registrations"]}>
            <FormButton
              active={false}
              text={"Login with Google"}
              icon={authMethods.google.activeIcon}
              inactiveIcon={authMethods.google.inactiveIcon}
            />
            <FormButton
              active={false}
              text={"Login with Github"}
              icon={authMethods.github.activeIcon}
              inactiveIcon={authMethods.github.inactiveIcon}
            />
          </div>
        </div>

        <div className={styles["alternative-page-link"]}>
          <span>
            Don't have an account?{" "}
            <Link to={"/auth/register"} className={globalStyles["link"]}>
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
