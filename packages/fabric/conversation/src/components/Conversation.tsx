import * as React from 'react';
import Comment from '../containers/Comment';
import Editor from './Editor';
import {
  Conversation as ConversationType,
  Comment as CommentType,
} from '../model';
import { SharedProps } from './Comment';

export interface Props extends SharedProps {
  id?: string;
  localId?: string;
  conversation?: ConversationType;
  containerId: string;

  // Dispatch
  onCreateConversation?: (
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ) => void;

  isExpanded?: boolean;
  meta?: {
    [key: string]: any;
  };
}

export default class Conversation extends React.PureComponent<Props> {
  private renderComments() {
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
    } = this.props;

    if (!conversation) {
      return;
    }

    const { conversationId } = conversation;

    return (comments || []).map(comment => (
      <Comment
        key={comment.commentId}
        conversationId={conversationId}
        comment={comment}
        user={user}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onRevertComment={onRevertComment}
        onRetry={this.onRetry}
        onCancel={onCancel}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
      />
    ));
  }

  private renderEditor() {
    const {
      isExpanded,
      onCancel,
      meta,
      dataProviders,
      user,
      conversation,
    } = this.props;
    const isInline = !!meta;
    const hasConversation = !!conversation;
    const canReply = !!user && (!isInline || (isExpanded && !hasConversation));

    if (canReply) {
      return (
        <Editor
          isExpanded={isExpanded}
          onSave={this.onSave}
          onCancel={onCancel}
          dataProviders={dataProviders}
          user={user}
        />
      );
    }
  }

  private onRetry = (comment: CommentType) => {
    this.onSave(comment.document, comment);
  };

  private onSave = async (value: any, comment?: CommentType) => {
    const {
      containerId,
      id = '',
      localId,
      meta,
      onAddComment,
      onCreateConversation,
    } = this.props;

    if (!id && !comment) {
      if (onCreateConversation) {
        onCreateConversation(localId!, containerId, value, meta);
      }
    } else {
      if (onAddComment) {
        onAddComment(id, id, value, comment);
      }
    }
  };

  render() {
    return (
      <div>
        {this.renderComments()}
        {this.renderEditor()}
      </div>
    );
  }
}
