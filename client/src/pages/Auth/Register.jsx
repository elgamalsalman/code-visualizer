import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./Register.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { validateEmail } from "src/common/utils/emailUtils";
import { validatePassword } from "src/common/utils/securityUtils";
import {
  authMethods,
  SideCanvas,
  EmailField,
  PasswordField,
  useAuthMethod,
} from "./shared";
import {
  FormButton,
  FormField,
  FormCheckBox,
  FormOrDivider,
} from "src/common/components/Form";
import {
  registerUserPassword,
  requestEmailVerification,
} from "src/api/authService";

function Register() {
  const navigate = useNavigate();

  // form data states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const authMethod = useAuthMethod(email);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const passwordConfirmed = useMemo(() => {
    return password === passwordConfirmation;
  }, [password, passwordConfirmation]);
  const passwordActive = useMemo(() => {
    return authMethod.name === authMethods.password.name;
  }, [authMethod]);

  const [agreement, setAgreement] = useState(false);

  // validate credentials
  const credentialsValid = useMemo(() => {
    // universal checks
    if (!validateEmail(email)) return false;
    if (!agreement) return false;

    if (authMethod.name === authMethods.nyu.name) return true;
    else if (authMethod.name === authMethods.password.name) {
      return validatePassword(password) && passwordConfirmed;
    } else return false;
  }, [authMethod, email, password, passwordConfirmed, agreement]);

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Registeration"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}>
          <div>Create Your</div>
          <div>CodeVisualizer Account!</div>
        </div>

        <div className={styles["form-main-body"]}>
          <div className={styles["internal-registration"]}>
            <FormField
              required={true}
              title={"name"}
              initialValue={name}
              onChange={(value) => setName(value)}
            />

            <EmailField state={email} stateSetter={setEmail} />
            <PasswordField
              active={passwordActive}
              title={"password"}
              state={password}
              stateSetter={setPassword}
              error={validatePassword(password) ? null : "not long enough"}
            />

            <PasswordField
              active={passwordActive}
              title={"confirm password"}
              state={passwordConfirmation}
              stateSetter={setPasswordConfirmation}
              error={passwordConfirmed ? null : "must be identical"}
            />

            <FormCheckBox
              required={true}
              text={"I agree to CodeVisualizer's Terms of Service"}
              onChange={(value) => {
                setAgreement(value);
              }}
              checked={agreement}
            />

            <FormButton
              cta={true}
              active={credentialsValid}
              icon={authMethod.activeIcon}
              inactiveIcon={authMethod.inactiveIcon}
              text={
                authMethod.name === authMethods.password.name
                  ? "Register!"
                  : "Register with NYU"
              }
              onClick={async () => {
                if (authMethod.name === authMethods.password.name) {
                  const result = await registerUserPassword(
                    email,
                    password,
                    name,
                  );
                  // TODO: handle case if result is erroneous
                  requestEmailVerification(email);
                  navigate("/auth/email-verification/send", {
                    state: { email },
                  });
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
              text={"Register with Google"}
              icon={authMethods.google.activeIcon}
              inactiveIcon={authMethods.google.inactiveIcon}
            />
            <FormButton
              active={false}
              text={"Register with Github"}
              icon={authMethods.github.activeIcon}
              inactiveIcon={authMethods.github.inactiveIcon}
            />
          </div>
        </div>

        <div className={styles["alternative-page-link"]}>
          <span>
            Already have an account?{" "}
            <Link to={"/auth/login"} className={globalStyles["link"]}>
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
