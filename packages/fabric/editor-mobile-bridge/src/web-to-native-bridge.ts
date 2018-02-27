export interface MentionBridge {
  showMentions(query: String);
  dismissMentions();
}

export class MarkState {
  markName: string;
  active: boolean;
  enabled: boolean;
}

export interface TextFormattingBridge {
  updateTextFormat(markStates: string);
}
