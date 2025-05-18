import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./shared.module.css";
import commonPageStyles from "../pages.module.css";

import { ReactComponent as Logo } from "src/assets/logo_with_name_white.svg";
import { ReactComponent as GoogleActiveIcon } from "src/common/assets/authIcons/google.svg";
import { ReactComponent as GoogleInactiveIcon } from "src/common/assets/authIcons/google_gray.svg";
import { ReactComponent as GithubActiveIcon } from "src/common/assets/authIcons/github.svg";
import { ReactComponent as GithubInactiveIcon } from "src/common/assets/authIcons/github_gray.svg";
import { ReactComponent as NYUActiveIcon } from "src/common/assets/authIcons/nyu_white.svg";
import { ReactComponent as NYUInactiveIcon } from "src/common/assets/authIcons/nyu_gray.svg";

import { validateEmail, validateNYUEmail } from "src/common/utils/emailUtils";
import { FormField } from "src/common/components/Form";

import MotoGraph from "src/components/MotoGraph/MotoGraph";

const SideCanvas = ({ pageTitle }) => {
  // routing states
  const navigate = useNavigate();

  return (
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
          <div>{pageTitle}</div>
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
  );
};

const EmailField = ({
  active = true,
  state: email,
  stateSetter: setEmail,
  error: parentError,
}) => {
  let error = validateEmail(email) ? null : "invalid email";
  error = error || parentError;
  return (
    <FormField
      active={active}
      whitespace={false}
      required={true}
      title={"email"}
      value={email}
      error={error}
      onChange={(value) => setEmail(value)}
    />
  );
};

const PasswordField = ({
  active,
  title,
  state: password,
  stateSetter: setPassword,
  error,
}) => {
  return (
    <FormField
      active={active}
      whitespace={false}
      required={true}
      title={title}
      valueHidden={true}
      value={password}
      error={error}
      onChange={(value) => setPassword(value)}
    />
  );
};

const authMethods = {
  password: {
    name: "password",
  },
  nyu: {
    name: "nyu",
    activeIcon: (
      <NYUActiveIcon
        className={clsx(styles["auth-icon"], styles["nyu-icon"])}
      />
    ),
    inactiveIcon: (
      <NYUInactiveIcon
        className={clsx(styles["auth-icon"], styles["nyu-icon"])}
      />
    ),
  },
  google: {
    name: "google",
    activeIcon: <GoogleActiveIcon className={styles["auth-icon"]} />,
    inactiveIcon: <GoogleInactiveIcon className={styles["auth-icon"]} />,
  },
  github: {
    name: "github",
    activeIcon: <GithubActiveIcon className={styles["auth-icon"]} />,
    inactiveIcon: <GithubInactiveIcon className={styles["auth-icon"]} />,
  },
};

const useAuthMethod = (email) => {
  return useMemo(() => {
    if (validateNYUEmail(email)) return authMethods.nyu;
    else return authMethods.password;
  }, [email]);
};

export { authMethods, SideCanvas, EmailField, PasswordField, useAuthMethod };
