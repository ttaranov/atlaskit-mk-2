// @flow

import React, { Component, type Node } from 'react';

import CommentLayout from './Layout';
import HeaderItems from './Header';
import FooterItems from './Footer';
import { Content } from '../styled/CommentStyles';

type Props = {
  /** An list of CommentAction items rendered as a row of buttons below the comment content */
  actions?: Array<Node>,
  /** A CommentAuthor element containing the name of the comment author. */
  author?: Node,
  /** The element to display as the Comment avatar - generally an Atlaskit Avatar */
  avatar: Node,
  /** Nested comments should be provided as children of the Comment */
  children?: Node,
  /** The main content of the Comment */
  content?: Node,
  /** Whether this comment should appear highlighted */
  highlighted?: boolean,
  /** Text to show in the "restricted to" label. Will display in the top items */
  restrictedTo?: Node,
  /** Enable "optimistic saving" mode, remove actions and show `savingText` prop */
  isSaving?: boolean,
  /** Text to show when in "optimistic saving" mode */
  savingText?: string,
  /** A CommentTime element containing the time to be displayed */
  time?: Node,
  /** The type of the comment - will be rendered in a lozenge at the top of the Comment */
  type?: string,
  /** will be rendered beside the time to show whether the comment is edited or not */
  edited?: Node,
  /** Indicates whether the component is in an error state - hides actions and time */
  isError?: boolean,
  /** A list of CommentAction items rendered with a warning icon instead of the actions */
  errorActions?: Array<Node>,
  /** Text to show in the error icon label */
  errorIconLabel?: string,
  /** Optional ID for the comment */
  id?: string,
};

export default class Comment extends Component<Props, {}> {
  static defaultProps = {
    actions: [],
    restrictedTo: '',
    highlighted: false,
    isSaving: false,
    savingText: 'Sending...',
    isError: false,
    errorActions: [],
    errorIconLabel: '',
  };

  render() {
    const {
      actions,
      author,
      avatar,
      children,
      content,
      edited,
      errorActions,
      errorIconLabel,
      highlighted,
      isError,
      isSaving,
      restrictedTo,
      savingText,
      time,
      type,
      id,
    } = this.props;

    const headerProps = {
      author,
      edited,
      isError,
      isSaving,
      restrictedTo,
      savingText,
      time,
      type,
    };
    const footerProps = {
      actions,
      errorActions,
      errorIconLabel,
      isError,
      isSaving,
    };
    const layoutContent = (
      <div>
        <HeaderItems {...headerProps} />
        <Content isDisabled={isSaving || isError}>{content}</Content>
        <FooterItems {...footerProps} />
      </div>
    );

    return (
      <CommentLayout
        id={id}
        avatar={avatar}
        content={layoutContent}
        highlighted={highlighted}
      >
        {children}
      </CommentLayout>
    );
  }
}
