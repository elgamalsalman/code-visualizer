import React, { useEffect, useId, useState } from "react";
import clsx from "clsx";
import styles from "./FormField.module.css";

function FormField({
  active = true,
  multiline = false,
  whitespace = true,
  valueHidden = false,
  required = false,
  title,
  initialValue,
  error = false,
  onChange,
}) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);

  // empty value if became inactive
  useEffect(() => {
    if (!active) setValue("");
  }, [active]);

  return (
    <div
      className={clsx(
        styles["field-div"],
        focus && styles["field-div-focused"],
        error && styles["field-div-error"],
        !active && styles["field-div-inactive"],
      )}
      onClick={() => {
        document.getElementById(id)?.focus();
      }}
    >
      <div className={styles["field-title"]}>
        {title}
        {required && (
          <span className={styles["required-field-asterisk"]}>*</span>
        )}
      </div>
      {active && (
        <input
          id={id}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={styles["field"]}
          value={value}
          type={valueHidden ? "password" : "text"}
          onChange={(e) => {
            let newValue = e.target.value;
            if (!multiline) newValue = newValue.replace("\n", "");
            if (!whitespace) newValue = newValue.replace(" ", "");
            if (newValue !== value) onChange(newValue);
            setValue(newValue);
          }}
          spellCheck={false}
          name={title}
        />
      )}
    </div>
  );
}

export default FormField;
