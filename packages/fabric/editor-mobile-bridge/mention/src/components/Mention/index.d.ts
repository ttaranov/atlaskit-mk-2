/// <reference types="react" />
import * as React from 'react';
import { MentionEventHandler } from '../../types';
import { FireAnalyticsEvent } from '@atlaskit/analytics';
export interface Props {
  id: string;
  text: string;
  isHighlighted?: boolean;
  accessLevel?: string;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
  fireAnalyticsEvent?: FireAnalyticsEvent;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}
export declare class MentionInternal extends React.PureComponent<Props, {}> {
  private startTime;
  private handleOnClick;
  private handleOnMouseEnter;
  private handleOnMouseLeave;
  private fireAnalytics;
  private getMentionType;
  render(): JSX.Element;
}
declare const Mention: typeof MentionInternal;
declare type Mention = MentionInternal;
export default Mention;
