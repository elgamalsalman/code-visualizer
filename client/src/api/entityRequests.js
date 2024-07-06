const getPushEntityEventsRequest = (userId, events) => {
  return {
    user_id: userId,
    events: events,
  };
};

const getPullServerFileTreeRequest = (userId) => {
  return {
    user_id: userId,
  };
};

const getPullServerEntitiesRequest = (userId, entityMetas) => {
  return {
    user_id: userId,
    entity_metas: entityMetas,
  };
};

export {
  getPushEntityEventsRequest,
  getPullServerFileTreeRequest,
  getPullServerEntitiesRequest,
};
