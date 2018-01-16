import { State } from '../domain';

export default function setEventProxy(state: State, action: any): State {
  if (action.type === 'SET_EVENT_PROXY') {
    const { itemId, uploadId } = action;
    const { uploads } = state;
    const upload = uploads[itemId];

    if (upload) {
      if (upload.proxy) {
        upload.proxy.push(uploadId);
      } else {
        upload.proxy = [uploadId];
      }
    }
    return { ...state, uploads };
  } else {
    return state;
  }
}
