import {
  useRef,
  useEffect,
  experimental_useEffectEvent as useEffectEvent,
} from "react";

const useAutoSave = (onSave, autoSavingDelay) => {
  const autoSavingTimerRef = useRef(null);

  const save = async () => {
    // if already up to date
    if (autoSavingTimerRef.current === null) return;

    // clear any auto-saving timers
    clearTimeout(autoSavingTimerRef.current);
    autoSavingTimerRef.current = null;

    // do the saving logic
    await onSave();
  };

  const saveEffectEvent = useEffectEvent(save);

  // save on unmount
  useEffect(() => {
    return async () => {
      await saveEffectEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // registerChange
  const registerChange = () => {
    if (autoSavingTimerRef.current === null) {
      // schedule an auto-save
      autoSavingTimerRef.current = setTimeout(() => save(), autoSavingDelay);
    }
  };

  return [save, registerChange];
};

export default useAutoSave;
