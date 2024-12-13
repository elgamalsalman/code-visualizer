import React, { useEffect, useState } from "react";
import {
  Link,
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import clsx from "clsx";
import styles from "./EmailVerificationVerify.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { SideCanvas } from "./shared";
import { verifyEmail } from "src/api/authService";

function EmailVerificationVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [loginTimer, setLoginTimer] = useState(3);

  // do the api call for the email verification
  useEffect(() => {
    (async () => {
      const { success } = await verifyEmail(token);
      if (success === false) setStatus("failed");
      else if (success === true) setStatus("success");
    })();
  }, [token]);

  // setup a timer for login redirection
  useEffect(() => {
    let interval = null;
    if (status === "success") {
      interval = setInterval(() => {
        setLoginTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // redirect to login once the timer is over
  useEffect(() => {
    if (loginTimer === 0) navigate("/auth/login");
  }, [loginTimer, navigate]);

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Email Verification"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}></div>

        <div className={styles["form-main-body"]}>
          <div className={styles["message"]}>
            {status === "pending" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "failed" && "Email Failed to Verify"}
          </div>

          <button
            class={clsx(
              styles["button"],
              status === "success" && styles["button-success"],
              status === "failed" && styles["button-failed"],
            )}
            onClick={(e) => {
              e.preventDefault();
              if (status === "success") navigate("/auth/login");
              else if (status === "failed") navigate("/auth/register");
            }}
          >
            <div class={styles["button-text"]} onClick={() => {}}>
              {status === "pending" && "Pending..."}
              {status === "success" && "Go to Login!"}
              {status === "failed" && "Back to Register"}
            </div>

            {status === "success" && (
              <div className={styles["redirect-timer"]}>{loginTimer}</div>
            )}
          </button>
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

export default EmailVerificationVerify;
