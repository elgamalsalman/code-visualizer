import React from "react";
import styles from "./Header.module.css";

import useAppStatus from "src/hooks/useAppStatus";
import { appStatuses } from "src/models/app/appModels";

import RunButton, {
  runButtonStatuses,
} from "src/common/components/RunButton/RunButton";

const appToButtonStatusMap = {
  [appStatuses.idle]: runButtonStatuses.run,
  [appStatuses.pending]: runButtonStatuses.pending,
  [appStatuses.running]: runButtonStatuses.kill,
};

const Header = ({ eventHandlers }) => {
  const appStatus = useAppStatus();
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
