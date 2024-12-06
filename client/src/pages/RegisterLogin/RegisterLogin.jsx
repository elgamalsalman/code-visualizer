import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import commonPageStyles from "../pages.module.css";
import styles from "./RegisterLogin.module.css";

import { ReactComponent as Logo } from "src/assets/logo_with_name_white.svg";

import { validateEmail } from "src/common/utils/emailUtils";
import { validatePassword } from "src/common/utils/securityUtils";
import MotoGraph from "src/components/MotoGraph/MotoGraph";
import {
  FormButton,
  FormField,
  FormOrDivider,
} from "src/common/components/Form";

const pageTypes = { register: "register", login: "login" };

function RegisterLogin({ type: pageType }) {
  // routing states
  const navigate = useNavigate();
  useEffect(() => {
    if (!Object.values(pageTypes).includes(pageType)) {
      console.log("unknown RegisterLogin page type");
    }
  }, [pageType]);

  // form data states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const confirmPassword = useCallback(() => {
    return password === passwordConfirmation;
  }, [password, passwordConfirmation]);

  return (
    <div className={clsx(styles["register-page"])}>
      <aside
        className={clsx(
          styles["compact-canvas"],
          commonPageStyles["page-dark-background"],
        )}
      >
        <div className={styles["canvas-content"]}>
          <div className={styles["canvas-header"]}>
            <div className={styles["logo-div"]} onClick={() => navigate("/")}>
              <Logo className={styles["logo"]} />
            </div>
            <div>|</div>
            <div>
              {pageType === pageTypes.register ? "Registration" : "Login"} Page
            </div>
          </div>
          <div className={styles["canvas-text-div"]}>
            <div>DSA:</div>
            <div>Made</div>
            <div>
              <span className={styles["emphasized-text"]}>Visual!</span>
            </div>
          </div>
        </div>
        <div className={styles["moto-graph-div"]}>
          <MotoGraph
            compact
            className={styles["moto-graph"]}
            divClassName={styles["moto-graph-div"]}
            offsetFactors={{
              x: 5 / 12,
              y: 2.25 / 12,
            }}
            dimensionFactors={{
              x: 5 / 12,
              y: 6 / 12,
            }}
          />
        </div>
      </aside>

      {pageType === pageTypes.login && (
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <div>Login to Your</div>
            <div>CodeVisualizer Account!</div>
          </div>

          <div className={styles["external-registrations"]}>
            <FormButton
              active={false}
              text={"Continue with Google"}
              icon={<div className={styles["google-icon"]}></div>}
              inactiveIcon={
                <div className={styles["google-grayed-icon"]}></div>
              }
            />
            <FormButton
              active={false}
              text={"Continue with Github"}
              icon={<div className={styles["github-icon"]}></div>}
              inactiveIcon={
                <div className={styles["github-grayed-icon"]}></div>
              }
            />
          </div>

          <FormOrDivider />

          <div className={styles["internal-registration"]}>
            <FormField
              whitespace={false}
              required={true}
              title={"email"}
              initialValue={email}
              error={!validateEmail(email)}
              onChange={(value) => setEmail(value)}
            />
            <FormField
              active={true}
              whitespace={false}
              required={true}
              title={"password"}
              valueHidden={true}
              initialValue={password}
              error={false}
              onChange={(value) => setPassword(value)}
            />
          </div>
          <FormButton
            cta={true}
            active={true}
            text={"Login!"}
            onClick={() => {}}
          />
        </div>
      )}

      {pageType === pageTypes.register && (
        <div className={styles["content"]}>
          <div className={styles["title"]}>
            <div>Create Your</div>
            <div>CodeVisualizer Account!</div>
          </div>

          <div className={styles["external-registrations"]}>
            <FormButton
              active={false}
              text={"Continue with Google"}
              icon={<div className={styles["google-icon"]}></div>}
              inactiveIcon={
                <div className={styles["google-grayed-icon"]}></div>
              }
            />
            <FormButton
              active={false}
              text={"Continue with Github"}
              icon={<div className={styles["github-icon"]}></div>}
              inactiveIcon={
                <div className={styles["github-grayed-icon"]}></div>
              }
            />
          </div>

          <FormOrDivider />

          <div className={styles["internal-registration"]}>
            <FormField
              whitespace={false}
              required={true}
              title={"email"}
              initialValue={email}
              error={!validateEmail(email)}
              onChange={(value) => setEmail(value)}
            />
            <FormField
              active={true}
              whitespace={false}
              required={true}
              title={"password"}
              valueHidden={true}
              initialValue={password}
              error={!validatePassword(password)}
              onChange={(value) => setPassword(value)}
            />
            <FormField
              active={true}
              whitespace={false}
              required={true}
              title={"confirm password"}
              valueHidden={true}
              initialValue={password}
              error={!confirmPassword()}
              onChange={(value) => setPasswordConfirmation(value)}
            />
          </div>
          <FormButton cta={true} active={true} text={"Create Account!"} />
        </div>
      )}
    </div>
  );
}

export default RegisterLogin;
export { pageTypes };
