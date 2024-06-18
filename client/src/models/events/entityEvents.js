const entityEventTypes = {
  create: "create",
  write: "write",
  delete: "delete",
};

const getEntityEvent = (eventType, entity) => {
  return {
    type: eventType,
    entity: entity,
  };
};

export { entityEventTypes, getEntityEvent };
