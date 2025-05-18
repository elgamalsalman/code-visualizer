import React from "react";
import clsx from "clsx";
import styles from "./FormCheckBox.module.css";

function FormCheckBox({
  required = false,
  checked,
  onChange: changeHandler,
  text,
}) {
  return (
    <div
      className={styles["checkbox-div"]}
      onClick={() => {
        changeHandler(!checked);
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        className={clsx(styles["checkbox"])}
        onKeyDown={(e) => {
          if (e.key === "Enter") changeHandler(!checked);
        }}
      />
      <div className={styles["text"]}>
        {text}
        {required && <span className={styles["required-asterisk"]}>*</span>}
      </div>
    </div>
  );
}

export default FormCheckBox;
