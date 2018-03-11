import NativeBridge from './bridge';

export default class DummyBridge implements NativeBridge {
  showMentions(query: String) {}
  dismissMentions() {}
  updateTextFormat(markStates: string) {}
  updateText(content: string) {}
}
