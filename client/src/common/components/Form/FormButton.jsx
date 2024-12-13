import React from "react";
import clsx from "clsx";
import styles from "./FormButton.module.css";

function FormButton({
  cta,
  active = true,
  text,
  icon,
  inactiveIcon,
  onClick: clickHandler,
}) {
  const children = (
    <div className={styles["content"]}>
      {((active && icon) || (!active && inactiveIcon)) && (
        <div className={styles["icon-div"]}>{active ? icon : inactiveIcon}</div>
      )}
      <div className={styles["text"]}>{text}</div>
    </div>
  );

  return active ? (
    <button
      className={clsx(styles["button"], cta && styles["button-cta"])}
      onClick={(e) => {
        e.preventDefault();
        clickHandler();
      }}
    >
      {children}
    </button>
  ) : (
    <div
      className={clsx(
        styles["button"],
        cta && styles["button-cta"],
        styles["button-inactive"],
      )}
    >
      {children}
    </div>
  );
}

export default FormButton;
