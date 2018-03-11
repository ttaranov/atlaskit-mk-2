export interface MentionBridge {
  showMentions(query: String);
  dismissMentions();
}

export interface TextFormattingBridge {
  updateTextFormat(markStates: string);
  updateText(content: string);
}

export default interface NativeBridge
  extends MentionBridge,
    TextFormattingBridge {};
