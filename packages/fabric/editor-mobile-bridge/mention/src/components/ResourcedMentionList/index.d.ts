/// <reference types="react" />
import * as React from 'react';
import { MentionDescription, OnMentionEvent } from '../../types';
import { MentionProvider } from '../../api/MentionResource';
import { PresenceProvider } from '../../api/PresenceResource';
export interface Props {
  resourceProvider: MentionProvider;
  presenceProvider?: PresenceProvider;
  query?: string;
  onSelection?: OnMentionEvent;
  resourceError?: Error;
}
export interface State {
  resourceError?: Error;
  mentions: MentionDescription[];
}
export default class ResourcedMentionList extends React.PureComponent<
  Props,
  State
> {
  private subscriberKey;
  private mentionListRef;
  constructor(props: any);
  componentDidMount(): void;
  componentWillReceiveProps(nextProps: any): void;
  componentWillUnmount(): void;
  selectNext: () => void;
  selectPrevious: () => void;
  selectIndex: (index: number, callback?: (() => any) | undefined) => void;
  selectId: (id: string, callback?: (() => any) | undefined) => void;
  chooseCurrentSelection: () => void;
  mentionsCount: () => number;
  private subscribeMentionProvider(mentionProvider?);
  private subscribePresenceProvider(presenceProvider?);
  private unsubscribeMentionProvider(mentionProvider?);
  private unsubscribePresenceProvider(presenceProvider?);
  private applyPropChanges(prevProps, nextProps);
  private refreshPresences(mentions);
  private filterChange;
  private filterError;
  private presenceUpdate;
  private notifySelection;
  private handleMentionListRef;
  render(): JSX.Element;
}
