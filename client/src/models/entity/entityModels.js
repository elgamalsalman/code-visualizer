const entityTypes = {
  file: "file",
  dir: "dir",
};

const getEntityMeta = (path, type, isSaved) => {
  return {
    path,
    type,
    isSaved,
  };
};

const getEntityData = (path, type, isSaved, content) => {
  return {
    meta: getEntityMeta(path, type, isSaved),
    content,
  };
};

const getFileTreeNode = (name, type) => {
  const node = {
    name: name,
    type: type,
  };
  if (type === entityTypes.dir) node.children = [];
  return node;
};

export { entityTypes, getEntityMeta, getEntityData, getFileTreeNode };
