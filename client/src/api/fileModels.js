const entityEventTypes = {
  create: "create",
  write: "write",
  delete: "delete",
};

const getEntityEvent = (eventType, entity) => {
  return {
    action: eventType,
    entity: entity,
  };
};

const getUpdateServerEntitiesRequest = (userId, entities) => {
  return {
    user_id: userId,
    events: entities.map((entity) =>
      getEntityEvent(entityEventTypes.write, entity),
    ),
  };
};

const getPullServerEntitiesRequest = (userId) => {
  return {
    user_id: userId,
  };
};

export {
  entityEventTypes,
  getEntityEvent,
  getUpdateServerEntitiesRequest,
  getPullServerEntitiesRequest,
};
