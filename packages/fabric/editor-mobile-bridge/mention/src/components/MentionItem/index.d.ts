/// <reference types="react" />
import * as React from 'react';
import { MentionDescription, OnMentionEvent } from '../../types';
export interface Props {
  mention: MentionDescription;
  selected?: boolean;
  onMouseMove?: OnMentionEvent;
  onSelection?: OnMentionEvent;
}
export default class MentionItem extends React.PureComponent<Props, {}> {
  private onMentionSelected;
  private onMentionMenuItemMouseMove;
  render(): JSX.Element;
}
