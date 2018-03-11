import {
  MentionBridge,
  TextFormattingBridge,
  default as NativeBridge,
} from './bridge';

export default class AndroidBridge implements NativeBridge {
  mentionBridge: MentionBridge;
  textFormatBridge: TextFormattingBridge;

  constructor() {
    this.mentionBridge = window.mentionsBridge as MentionBridge;
    this.textFormatBridge = window.textFormatBridge as TextFormattingBridge;
  }

  showMentions(query: String) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    this.mentionBridge.dismissMentions();
  }

  updateTextFormat(markStates: string) {
    this.textFormatBridge.updateTextFormat(markStates);
  }

  updateText(content: string) {
    this.textFormatBridge.updateText(content);
  }
}
