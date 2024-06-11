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

export { entityTypes, getEntityMeta, getEntityData };
