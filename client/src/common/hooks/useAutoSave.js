import { useRef, useEffect } from "react";

const useAutoSave = (onSave, autoSavingDelay) => {
  const autoSavingTimerRef = useRef(null);
  const changesMapRef = useRef(new Map());

  const save = async () => {
    // if already up to date
    if (autoSavingTimerRef.current === null) return;

    // clear any auto-saving timers
    clearTimeout(autoSavingTimerRef.current);
    autoSavingTimerRef.current = null;

    // do the saving logic
    const changes = [];
    changesMapRef.current.forEach((value, key) => changes.push(value));
    await onSave(changes);

    // clear changes set
    changesMapRef.current.clear();
  };

  // save on unmount
  useEffect(() => {
    return async () => {
      await save();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // registerChange
  const registerChange = (changeId, change) => {
    // add change to set of changes
    if (changeId !== undefined) changesMapRef.current.set(changeId, change);

    if (autoSavingTimerRef.current === null) {
      // schedule an auto-save
      autoSavingTimerRef.current = setTimeout(() => save(), autoSavingDelay);
    }
  };

  return [save, registerChange];
};

export default useAutoSave;
