import RendererBridge from './bridge';
import { eventDispatcher } from './dispatcher';
import { resolvePromise, rejectPromise } from '../cross-platform-promise';

export default class RendererBridgeImpl implements RendererBridge {
  /** Renderer bridge MVP to set the content */
  setContent(content: string) {
    if (eventDispatcher) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        return;
      }
      eventDispatcher.emit('setRendererContent', { content });
    }
  }

  onPromiseResolved(uuid: string, paylaod: string) {
    resolvePromise(uuid, JSON.parse(paylaod));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }
}
