const getPushEntityEventsRequest = (userId, events) => {
  return {
    user_id: userId,
    events: events,
  };
};

const getPullServerFileTreeRequest = () => {
  return {};
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
