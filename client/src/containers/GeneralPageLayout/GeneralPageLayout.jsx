import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./GeneralPageLayout.module.css";

import { AlerterProvider } from "src/contexts/alerterContexts";
import { UserProvider } from "src/contexts/userContext";

import Alerter from "src/containers/Alerter/Alerter";

const GeneralPageLayout = () => {
  return (
    <div className={styles["layout"]}>
      <Alerter />
      <Outlet />
    </div>
  );
};

const GeneralPageLayoutWrapper = () => {
  return (
    <AlerterProvider>
      <UserProvider>
        <GeneralPageLayout />
      </UserProvider>
    </AlerterProvider>
  );
};

export default GeneralPageLayoutWrapper;
