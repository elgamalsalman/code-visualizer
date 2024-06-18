import React from "react";

import { ReactComponent as CPPIcon } from "src/common/assets/devIcons/cpp.svg";
import { ReactComponent as CSharpIcon } from "src/common/assets/devIcons/csharp.svg";
import { ReactComponent as HIcon } from "src/common/assets/devIcons/h.svg";
import { ReactComponent as HPPIcon } from "src/common/assets/devIcons/hpp.svg";
import { ReactComponent as JSONIcon } from "src/common/assets/devIcons/json.svg";
import { ReactComponent as LogIcon } from "src/common/assets/devIcons/log.svg";
import { ReactComponent as MakefileIcon } from "src/common/assets/devIcons/makefile.svg";
import { ReactComponent as MarkdownIcon } from "src/common/assets/devIcons/markdown.svg";

import { DocumentIcon } from "@heroicons/react/24/outline";

function DynamicFileIcon({ className, filename }) {
  const props = { className: className };
  const fileIconMap = {
    cpp: <CPPIcon {...props} />,
    cs: <CSharpIcon {...props} />,
    h: <HIcon {...props} />,
    hpp: <HPPIcon {...props} />,
    json: <JSONIcon {...props} />,
    log: <LogIcon {...props} />,
    makefile: <MakefileIcon {...props} />,
    md: <MarkdownIcon {...props} />,
  };

  // map to desired icon based on extension
  const extension = filename.split(".").pop();
  let icon = fileIconMap[extension];
  if (icon === undefined) icon = <DocumentIcon {...props} />;

  return icon;
}

export default DynamicFileIcon;
