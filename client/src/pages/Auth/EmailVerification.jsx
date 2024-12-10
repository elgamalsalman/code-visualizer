import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./EmailVerification.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { SideCanvas } from "./shared";

function EmailVerification() {
  const location = useLocation();
  const { email } = location.state;

  // email resending
  const [resent, setResent] = useState(false);

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Email Verification"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}>
          <div>Verify Your Email</div>
        </div>
        <div className={styles["form-main-body"]}>
          <div className={styles["message"]}>
            A verification email was sent to the following email
          </div>
          <div className={styles["email-div"]}>{email}</div>
          <div
            className={clsx(styles["resend"], resent && styles["resend-done"])}
            onClick={() => {
              if (!resent) {
                // TODO: resent email
                setResent(true);
              }
            }}
          >
            {resent ? "email resent" : "resend email"}
          </div>
        </div>
        <div className={styles["alternative-page-links"]}>
          <div>
            <Link to={"/register"} className={globalStyles["link"]}>
              Register
            </Link>
          </div>
          <div className={styles["links-separator"]}></div>
          <div>
            <Link to={"/login"} className={globalStyles["link"]}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
