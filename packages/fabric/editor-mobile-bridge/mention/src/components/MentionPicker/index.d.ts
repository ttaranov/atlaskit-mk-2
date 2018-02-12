/// <reference types="react" />
import * as React from 'react';
import { OnMentionEvent } from '../../types';
import { MentionProvider } from '../../api/MentionResource';
import { PresenceProvider } from '../../api/PresenceResource';
export interface OnOpen {
  (): void;
}
export interface OnClose {
  (): void;
}
export declare type Position = 'above' | 'below' | 'auto';
export interface Props {
  resourceProvider: MentionProvider;
  presenceProvider?: PresenceProvider;
  query?: string;
  onSelection?: OnMentionEvent;
  onOpen?: OnOpen;
  onClose?: OnClose;
  target?: string;
  position?: Position;
  zIndex?: number | string;
  offsetX?: number;
  offsetY?: number;
}
export interface State {
  visible: boolean;
  info?: string;
}
/**
 * @class MentionPicker
 */
export default class MentionPicker extends React.PureComponent<Props, State> {
  private subscriberKey;
  private mentionListRef;
  static defaultProps: {
    onSelection: () => void;
    onOpen: () => void;
    onClose: () => void;
  };
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
  private applyPropChanges(prevProps, nextProps);
  private subscribeResourceProvider(resourceProvider);
  private unsubscribeResourceProvider(resourceProvider);
  /**
   * Called after the 'visible' state is changed to decide whether the onOpen or onClose
   * handlers should be called.
   *
   * It should be noted that the visible state of the component is not considered in
   * this function. Instead the old state and new state should be passed as parameters.
   */
  private onFilterVisibilityChange;
  private filterChange;
  private filterError;
  private filterInfo;
  private handleMentionListRef;
  render(): JSX.Element;
}
