// @flow
import React, { PureComponent } from 'react';
import CommentContainer from '../containers/Comment';
import Editor from './Editor';
import type { Conversation as ConversationType } from '../model';
import Comment from './Comment';
import type { SharedProps } from './Comment';

export type Props = {
  id?: string,
  localId?: string,
  conversation?: ConversationType,
  containerId: string,

  // Dispatch
  onCreateConversation?: (
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ) => void,

  isExpanded?: boolean,
  meta?: {
    [key: string]: any,
  },
} & SharedProps;

export default class Conversation extends PureComponent<Props> {
  _renderComments() {
    const {
      comments,
      conversation,
      onAddComment,
      onUpdateComment,
      onDeleteComment,
      onRevertComment,
      onUserClick,
      onCancel,
      user,
      dataProviders,
      renderEditor,
      containerId,
    } = this.props;

    if (!conversation) {
      return null;
    }

    const { conversationId } = conversation;

    return (comments || []).map(comment => (
      <CommentContainer
        key={comment.commentId}
        conversationId={conversationId}
        comment={comment}
        user={user}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onRevertComment={onRevertComment}
        onRetry={this._onRetry(comment.document)}
        onCancel={onCancel}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
        renderComment={props => <Comment {...props} />}
        renderEditor={renderEditor}
        containerId={containerId}
      />
    ));
  }

  _renderEditor() {
    const {
      isExpanded,
      onCancel,
      meta,
      dataProviders,
      user,
      conversation,
      renderEditor,
    } = this.props;
    const isInline = !!meta;
    const hasConversation = !!conversation;
    const canReply = !!user && (!isInline || (isExpanded && !hasConversation));

    if (canReply) {
      return (
        <Editor
          isExpanded={isExpanded}
          onSave={this._onSave}
          onCancel={onCancel}
          dataProviders={dataProviders}
          user={user}
          renderEditor={renderEditor}
        />
      );
    }

    return null;
  }

  _onRetry = (document: any) => (commentLocalId?: string) => {
    this._onSave(document, commentLocalId);
  };

  _onSave = (value: any, commentLocalId?: string) => {
    const {
      containerId,
      id,
      localId,
      meta,
      onAddComment,
      onCreateConversation,
      conversation,
    } = this.props;

    if (!id && !commentLocalId) {
      if (onCreateConversation && localId && containerId) {
        onCreateConversation(localId, containerId, value, meta);
      }
    } else if (conversation) {
      if (onAddComment) {
        const conversationId = id || conversation.conversationId;
        onAddComment(conversationId, conversationId, value, commentLocalId);
      }
    }
  };

  render() {
    return (
      <div>
        {this._renderComments()}
        {this._renderEditor()}
      </div>
    );
  }
}
