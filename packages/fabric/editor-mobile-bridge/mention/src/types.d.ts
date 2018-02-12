/// <reference types="react" />
import { SyntheticEvent } from 'react';
export interface HighlightDetail {
  start: number;
  end: number;
}
export interface Highlight {
  name: HighlightDetail[];
  mentionName: HighlightDetail[];
  nickname: HighlightDetail[];
}
export interface Presence {
  time?: string;
  status?: string;
}
export interface MentionDescription {
  id: string;
  avatarUrl?: string;
  name?: string;
  mentionName?: string;
  nickname?: string;
  highlight?: Highlight;
  lozenge?: string;
  presence?: Presence;
  accessLevel?: string;
  weight?: number;
  inContext?: boolean;
  userType?: string;
}
export interface MentionsResult {
  mentions: MentionDescription[];
  query: string;
}
export declare type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;
export interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}
export declare enum MentionType {
  SELF = 0,
  RESTRICTED = 1,
  DEFAULT = 2,
}
export declare function isRestricted(accessLevel: any): boolean;
export declare function isSpecialMention(
  mention: MentionDescription,
): boolean | '' | undefined;
export declare function isAppMention(
  mention: MentionDescription,
): boolean | '' | undefined;
export declare function isSpecialMentionText(mentionText: string): boolean | '';
