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

export type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;

export interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export enum MentionType {
  SELF,
  RESTRICTED,
  DEFAULT,
}

enum UserAccessLevel {
  NONE,
  SITE,
  APPLICATION,
  CONTAINER,
}

enum UserType {
  DEFAULT,
  SPECIAL,
  APP,
  TEAM,
  SYSTEM,
}

export function isRestricted(accessLevel) {
  return (
    accessLevel && accessLevel !== UserAccessLevel[UserAccessLevel.CONTAINER]
  );
}

export function isSpecialMention(mention: MentionDescription): boolean {
  return !!mention.userType && mention.userType === UserType[UserType.SPECIAL];
}

export function isAppMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.APP];
}

export function isTeamMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.TEAM];
}

export function isSpecialMentionText(mentionText: string) {
  return mentionText && (mentionText === '@all' || mentionText === '@here');
}
