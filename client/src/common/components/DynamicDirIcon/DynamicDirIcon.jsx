import React from "react";

import { ReactComponent as FolderSrcOpenIcon } from "src/common/assets/devIcons/folder-src-open.svg";
import { ReactComponent as FolderSrcIcon } from "src/common/assets/devIcons/folder-src.svg";
import { ReactComponent as FolderTestOpenIcon } from "src/common/assets/devIcons/folder-test-open.svg";
import { ReactComponent as FolderTestIcon } from "src/common/assets/devIcons/folder-test.svg";

import { FolderIcon } from "@heroicons/react/24/solid";
import { FolderOpenIcon } from "@heroicons/react/24/solid";

function DynamicDirIcon({ className, dirname, isOpen }) {
  const props = { className: className };
  const dirIconMap = {
    src: [<FolderSrcIcon {...props} />, <FolderSrcOpenIcon {...props} />],
    test: [<FolderTestIcon {...props} />, <FolderTestOpenIcon {...props} />],
  };

  // map to desired icon based on extension
  let icons = dirIconMap[dirname];
  if (icons === undefined) {
    icons = [<FolderIcon {...props} />, <FolderOpenIcon {...props} />];
  }

  return isOpen ? icons[1] : icons[0];
}

export default DynamicDirIcon;
