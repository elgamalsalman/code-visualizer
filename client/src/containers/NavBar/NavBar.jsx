import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./NavBar.module.css";

import { ReactComponent as Logo } from "src/assets/logo_with_name_white.svg";

function NavBar() {
  const navigate = useNavigate();

  return (
    <div className={styles["nav-bar-div"]}>
      <div className={styles["nav-bar"]}>
        <div
          className={clsx(styles["nav-bar-section"], styles["left-section"])}
        >
          <div className={styles["logo-div"]} onClick={() => navigate("/")}>
            <Logo className={styles["logo"]} />
          </div>
          <div className={clsx(styles["page-button"], styles["about-button"])}>
            About
          </div>
          <div
            className={clsx(styles["page-button"], styles["products-button"])}
          >
            Products
          </div>
          <div
            className={clsx(styles["page-button"], styles["enterprise-button"])}
          >
            Enterprise
          </div>
        </div>

        <div
          className={clsx(styles["nav-bar-section"], styles["middle-section"])}
        ></div>

        <div
          className={clsx(styles["nav-bar-section"], styles["right-section"])}
        >
          <div
            className={clsx(styles["page-button"], styles["login-button"])}
            onClick={() => navigate("register")}
          >
            Login
          </div>
          <div className={styles["start-button"]}>Code Now!</div>
        </div>
      </div>
      <div className={styles["nav-bar-border"]}></div>
    </div>
  );
}

export default NavBar;
