import { State } from '../domain';

export default function serviceConnect(state: State, action: any): State {
  if (action.type === 'SERVICE_CONNECT') {
    const view = Object.assign({}, state.view, {
      connect: { name: action.serviceName },
      path: false,
    });
    return Object.assign({}, state, { view });
  } else {
    return state;
  }
}
