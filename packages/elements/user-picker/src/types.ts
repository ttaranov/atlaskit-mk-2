export interface HighlightDetail {
  start: number;
  end: number;
}

export interface Highlight {
  name: HighlightDetail[];
  nickname: HighlightDetail[];
}

export interface User {
  id: string;
  avatarUrl?: string;
  name?: string;
  nickname?: string;
  highlight?: Highlight;
  lozenge?: string;
}
