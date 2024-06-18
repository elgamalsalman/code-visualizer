import config from "src/config";

const readFileFromLocalStorage = async (entityMeta) => {
  const key = `${config.localStorage.fileKeysPrefix}${entityMeta.path}`;
  return JSON.parse(localStorage.getItem(key));
};

const writeFileToLocalStorage = async (entity) => {
  const key = `${config.localStorage.fileKeysPrefix}${entity.meta.path}`;
  localStorage.setItem(key, JSON.stringify(entity.content));
};

export { readFileFromLocalStorage, writeFileToLocalStorage };
