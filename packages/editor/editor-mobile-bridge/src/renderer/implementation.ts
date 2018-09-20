import RendererBridge from './bridge';
import { eventDispatcher } from './dispatcher';

export default class RendererBridgeImpl implements RendererBridge {
  /** Renderer bridge MVP to set the content */
  setContent(content: string) {
    if (eventDispatcher) {
      eventDispatcher.emit('setRendererContent', { content });
    }
  }
}
