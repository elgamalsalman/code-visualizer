import React, { useEffect, useId, useState } from "react";
import clsx from "clsx";
import styles from "./FormField.module.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function FormField({
  active = true,
  multiline = false,
  whitespace = true,
  valueHidden = false,
  required = false,
  title,
  initialValue,
  error,
  onChange,
}) {
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);
  const [receivedInput, setReceivedInput] = useState(false);

  // empty value if became inactive
  useEffect(() => {
    if (!active) setValue("");
  }, [active]);

  // on getting input
  useEffect(() => {
    if (value) setReceivedInput(true);
  }, [value]);

  return (
    <div
      className={clsx(
        styles["field-div"],
        focus && styles["field-div-focused"],
        receivedInput && error && styles["field-div-error"],
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
        <span className={styles["error-message"]}>
          {receivedInput && error && (
            <ExclamationTriangleIcon className={styles["error-icon"]} />
          )}
          <span>{receivedInput && error}</span>
        </span>
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
