import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./PasswordResetSend.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import api from "src/api/api";
import useAlerter from "src/hooks/useAlerter";

import { authMethods, EmailField, SideCanvas, useAuthMethod } from "./shared";
import { FormButton } from "src/common/components/Form";
import { validateEmail } from "src/common/utils/emailUtils";

function PasswordResetSend() {
  const location = useLocation();
  const [_, alerter] = useAlerter();
  const [email, setEmail] = useState(location.state.email || "");
  const [status, setStatus] = useState("pending");

  const emailValid = useMemo(() => {
    if (!validateEmail(email)) return false;
    return true;
  }, [email]);

  const authMethod = useAuthMethod(email);
  const authPassword = useMemo(() => {
    return authMethod.name === authMethods.password.name;
  }, [authMethod]);

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Password Reset"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}></div>
        <div className={styles["form-main-body"]}>
          <EmailField
            state={email}
            stateSetter={(email) => {
              if (status === "pending") setEmail(email);
            }}
          />
          <FormButton
            active={authPassword && emailValid && status === "pending"}
            inactiveIcon={authMethod.inactiveIcon}
            text={(() => {
              if (status === "sending") return "Sending Email...";
              if (status === "sent") return "Email Sent!";
              if (status === "failed") return "Failed to Send Email!";
              if (authMethod.name === authMethods.nyu.name)
                return "Login with NYU Instead";
              else return "Send Password Reset Email";
            })()}
            onClick={async () => {
              setStatus("sending");
              const { success, error } =
                await api.auth.passwordReset.request(email);
              if (success) {
                alerter.create(
                  alerter.alertTypes.success,
                  "Password Reset Email Sent!",
                );
                setStatus("sent");
              }
              if (error) {
                alerter.create(alerter.alertTypes.error, error);
                setStatus("failed");
              }
            }}
          />
        </div>
        <div className={styles["alternative-page-links"]}>
          <div>
            <Link to={"/auth/register"} className={globalStyles["link"]}>
              Register
            </Link>
          </div>
          <div className={styles["links-separator"]}></div>
          <div>
            <Link to={"/auth/login"} className={globalStyles["link"]}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetSend;
