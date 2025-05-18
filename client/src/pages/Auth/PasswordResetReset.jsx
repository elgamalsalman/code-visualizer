import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import styles from "./PasswordResetReset.module.css";
import globalStyles from "src/pages/globalStyles.module.css";

import { PasswordField, SideCanvas } from "./shared";
import { resetPassword } from "src/api/authService";
import useAlerter from "src/hooks/useAlerter";
import { validatePassword } from "src/common/utils/securityUtils";
import { FormButton } from "src/common/components/Form";

function PasswordResetReset() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [_, alerter] = useAlerter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const passwordConfirmed = useMemo(() => {
    return password === passwordConfirmation;
  }, [password, passwordConfirmation]);

  // validate credentials
  const passwordValid = useMemo(() => {
    return validatePassword(password) && passwordConfirmed;
  }, [password, passwordConfirmed]);

  return (
    <div className={clsx(styles["page"])}>
      <SideCanvas pageTitle={"Password Reset"} />

      <div className={styles["content"]}>
        <div className={styles["title"]}>
          <div>Choose New Password</div>
        </div>
        <div className={styles["form-main-body"]}>
          <PasswordField
            active={true}
            title={"password"}
            state={password}
            stateSetter={setPassword}
            error={validatePassword(password) ? null : "not long enough"}
          />

          <PasswordField
            active={true}
            title={"confirm password"}
            state={passwordConfirmation}
            stateSetter={setPasswordConfirmation}
            error={passwordConfirmed ? null : "must be identical"}
          />

          <FormButton
            cta={true}
            active={passwordValid}
            text={"Reset Password"}
            onClick={async () => {
              const { success, error } = await resetPassword(token, password);
              if (success)
                alerter.create(alerter.alertTypes.success, "Changed Password!");
              if (error) alerter.create(alerter.alertTypes.error, error);
              navigate("/auth/login");
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

export default PasswordResetReset;
