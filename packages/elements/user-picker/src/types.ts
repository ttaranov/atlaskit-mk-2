export interface HighlightRange {
  start: number;
  end: number;
}

export interface Highlight {
  name: HighlightRange[];
  nickname: HighlightRange[];
}

export interface User {
  id: string;
  avatarUrl?: string;
  name?: string;
  nickname: string;
  highlight?: Highlight;
  lozenge?: string;
}
