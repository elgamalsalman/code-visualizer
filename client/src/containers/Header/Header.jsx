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

const Header = ({ eventHandlers }) => {
  const [appStatus, setAppStatus] = useAppStatusContext();
  return (
    <header className={styles["header"]}>
      <div className={styles["run-button-div"]}>
        <RunButton
          status={appToButtonStatusMap[appStatus]}
          onRun={eventHandlers.onRun}
          onKill={eventHandlers.onKill}
        />
      </div>
    </header>
  );
};

export default Header;
