import config from "src/config";

const readFileFromStorage = async (entityMeta) => {
  const key = `${config.storage.fileKeysPrefix}${entityMeta.path}`;
  return JSON.parse(sessionStorage.getItem(key));
};

const writeFileToStorage = async (entity) => {
  const key = `${config.storage.fileKeysPrefix}${entity.meta.path}`;
  sessionStorage.setItem(key, JSON.stringify(entity.content));
};

export { readFileFromStorage, writeFileToStorage };
