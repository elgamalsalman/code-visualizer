import {
  entityEventTypes,
  getEntityEvent,
} from "src/models/events/entityEvents";

const getPushEntityEventsRequest = (userId, events) => {
  return {
    user_id: userId,
    events: events,
  };
};

const getPullServerEntitiesRequest = (userId) => {
  return {
    user_id: userId,
  };
};

export { getPushEntityEventsRequest, getPullServerEntitiesRequest };
