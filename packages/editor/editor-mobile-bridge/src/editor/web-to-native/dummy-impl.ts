import NativeBridge from './bridge';

export default class DummyBridge implements NativeBridge {
  showMentions(query: String) {}
  dismissMentions() {}
  updateTextFormat(markStates: string) {}
  updateText(content: string) {}
  submitPromise(name: string, uuid: string, args: string) {}
  updateBlockState(currentBlockType: string) {}
  updateListState(listState: string) {}
}
