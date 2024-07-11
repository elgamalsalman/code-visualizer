import React from "react";
import styles from "./Header.module.css";

import { appStatuses } from "src/models/app/appModels";

import RunButton, {
  runButtonStatuses,
} from "src/common/components/RunButton/RunButton";
import { useAppStatusContext } from "src/hooks/useAppStatusContext";

const appToButtonStatusMap = {
  [appStatuses.idle]: runButtonStatuses.run,
  [appStatuses.pending]: runButtonStatuses.pending,
  [appStatuses.running]: runButtonStatuses.kill,
};

const Header = ({ runEventHandlers }) => {
  const [appStatus, setAppStatus] = useAppStatusContext();
  return (
    <header className={styles["header"]}>
      <div className={styles["run-button-div"]}>
        <RunButton
          status={appToButtonStatusMap[appStatus]}
          onRun={runEventHandlers.runHandler}
          onKill={runEventHandlers.killHandler}
        />
      </div>
    </header>
  );
};

export default Header;
