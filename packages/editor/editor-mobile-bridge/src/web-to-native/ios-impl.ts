import NativeBridge from './bridge';

export default class IosBridge implements NativeBridge {
  showMentions(query: String) {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'showMentions',
        query: query,
      });
    }
  }

  dismissMentions() {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'dismissMentions',
      });
    }
  }
  updateTextFormat(markStates: string) {
    if (window.webkit && window.webkit.messageHandlers.textFormatBridge) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateTextFormat',
        states: markStates,
      });
    }
  }
  updateText(content: string) {
    if (window.webkit && window.webkit.messageHandlers.textFormatBridge) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateText',
        query: content,
      });
    }
  }
  getServiceHost(): string {
    if (window.mediaBridge) {
      return window.mediaBridge.getServiceHost();
    } else {
      return '';
    }
  }
  getAuth(): string {
    return '';
  }

  getCollection(): string {
    return '';
  }
}
