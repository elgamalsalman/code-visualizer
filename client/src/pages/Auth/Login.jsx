import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./Login.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { validatePassword } from "src/common/utils/securityUtils";
import {
  authMethods,
  SideCanvas,
  EmailField,
  PasswordField,
  useAuthMethod,
} from "./shared";
import { FormButton, FormOrDivider } from "src/common/components/Form";
import { passwordAuthenticate } from "src/api/authService";

function Login() {
  // form data states
  const [email, setEmail] = useState("");
  const authMethod = useAuthMethod(email);

  const [password, setPassword] = useState("");
  const passwordActive = useMemo(() => {
    return authMethod.name === authMethods.password.name;
  }, [authMethod]);

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
              error={validatePassword(password) ? null : "not long enough"}
            />

            <FormButton
              cta={true}
              active={true}
              icon={authMethod.activeIcon}
              inactiveIcon={authMethod.inactiveIcon}
              text={
                authMethod.name === authMethods.password.name
                  ? "Login!"
                  : "Login with NYU"
              }
              onClick={async () => {
                if (authMethod.name === authMethods.password.name) {
                  console.log("logging in");
                  const result = await passwordAuthenticate(email, password);
                  console.log(result);
                  // TODO: do something with the user data, maybe not here actually
                  // maybe in the register function itself
                } else if (authMethod.name === authMethods.nyu.name) {
                  // TODO: nyu authentiation
                } else {
                  console.log("unkown authentication type!");
                }
              }}
            />
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
