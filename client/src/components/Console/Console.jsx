import React, { useRef, useEffect } from "react";

import ConsoleRun from "components/Console/ConsoleRun";

const Console = ({ runs, onInput }) => {
  const consoleEndRef = useRef(null);

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
