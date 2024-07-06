import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ConsoleRun from "./ConsoleRun";

const Console = ({ onInput }) => {
  const consoleEndRef = useRef(null);
  const runs = useSelector((state) => state.runs);

  // Scroll to bottom when runs change
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [runs]);

  return (
    <div className="console-div">
      <div className="runs-div">
        {runs.map((run, index) => (
          <ConsoleRun
            key={run.id}
            run={run}
            logInput={index === runs.length - 1 ? onInput : null}
          />
        ))}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};

export default Console;
