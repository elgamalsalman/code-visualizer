import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./GeneralPageLayout.module.css";

import { AlerterProvider } from "src/contexts/alerterContexts";
import { AuthProvider } from "src/contexts/authContext";

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
      <AuthProvider>
        <GeneralPageLayout />
      </AuthProvider>
    </AlerterProvider>
  );
};

export default GeneralPageLayoutWrapper;
