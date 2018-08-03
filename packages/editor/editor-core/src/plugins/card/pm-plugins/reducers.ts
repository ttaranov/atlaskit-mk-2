import {
  CardPluginState,
  CardPluginAction,
  SetProvider,
  Queue,
  Resolve,
} from '../types';

const queue = (state: CardPluginState, action: Queue) => {
  const { url, pos } = action;
  const { requests, provider } = state;

  if (!provider) {
    return state;
  }

  const request = requests[url] || { positions: [] };
  const positions = [...request.positions, pos];

  return {
    ...state,
    requests: {
      ...requests,
      [url]: {
        positions,
      },
    },
  };
};

const resolve = (state: CardPluginState, action: Resolve) => {
  const requests = Object.keys(state.requests).reduce((requests, url) => {
    if (url !== action.url) {
      requests[url] = state.requests[url];
    }

    return requests;
  }, {});

  return {
    ...state,
    requests,
  };
};

const setProvider = (state: CardPluginState, action: SetProvider) => {
  return { ...state, provider: action.provider };
};

export default (state: CardPluginState, action: CardPluginAction) => {
  switch (action.type) {
    case 'QUEUE':
      return queue(state, action);
    case 'SET_PROVIDER':
      return setProvider(state, action);
    case 'RESOLVE':
      return resolve(state, action);
    default:
      return state;
  }
};
