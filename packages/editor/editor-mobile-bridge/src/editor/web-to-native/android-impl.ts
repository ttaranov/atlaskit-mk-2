import {
  MentionBridge,
  TextFormattingBridge,
  default as NativeBridge,
  MediaBridge,
  PromiseBridge,
  ListBridge,
} from './bridge';

export default class AndroidBridge implements NativeBridge {
  mentionBridge: MentionBridge;
  textFormatBridge: TextFormattingBridge;
  mediaBridge: MediaBridge;
  promiseBridge: PromiseBridge;
  listBridge: ListBridge;

  constructor() {
    this.mentionBridge = window.mentionsBridge as MentionBridge;
    this.textFormatBridge = window.textFormatBridge as TextFormattingBridge;
    this.mediaBridge = window.mediaBridge as MediaBridge;
    this.promiseBridge = window.promiseBridge as PromiseBridge;
    this.listBridge = window.listBridge as ListBridge;
  }

  showMentions(query: String) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    /*TODO: implement when mentions are ready */
  }

  updateTextFormat(markStates: string) {
    this.textFormatBridge.updateTextFormat(markStates);
  }

  updateText(content: string) {
    this.textFormatBridge.updateText(content);
  }

  getServiceHost(): string {
    return this.mediaBridge.getServiceHost();
  }

  getCollection(): string {
    return this.mediaBridge.getCollection();
  }

  submitPromise(name: string, uuid: string, args: string) {
    this.promiseBridge.submitPromise(name, uuid, args);
  }
  updateBlockState(currentBlockType: string) {
    this.textFormatBridge.updateBlockState(currentBlockType);
  }
  updateListState(listState: string) {
    this.listBridge.updateListState(listState);
  }
}
