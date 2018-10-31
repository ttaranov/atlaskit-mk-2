import RendererBridge, { LinkBridge } from './bridge';
import { eventDispatcher } from './dispatcher';
import { resolvePromise, rejectPromise } from '../cross-platform-promise';

declare global {
  interface Window {
    linkBridge?: LinkBridge;
    webkit?: any;
  }
}
export default class RendererBridgeImpl implements RendererBridge {
  linkBridge: LinkBridge;

  constructor() {
    this.linkBridge = window.linkBridge as LinkBridge;
  }

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

  onLinkClick(url: string) {
    if (window.webkit && window.webkit.messageHandlers.linkBridge) {
      window.webkit.messageHandlers.linkBridge.postMessage({
        name: 'linkClick',
        url,
      });
    } else if (this.linkBridge) {
      return this.linkBridge.onLinkClick(url);
    }
  }
}
