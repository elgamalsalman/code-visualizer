import { useState, useEffect } from "react";
import { pullServerFileTree } from "src/api/fileService";

import config from "src/config";

const useServerPullFileTree = () => {
  const [fileTree, setFileTree] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const serverFileTree = await pullServerFileTree(config.userId, false);
        setFileTree(serverFileTree);
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    })();
  }, []);
  return fileTree;
};

export default useServerPullFileTree;
