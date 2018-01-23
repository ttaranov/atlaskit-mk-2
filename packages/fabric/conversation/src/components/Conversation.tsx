import * as React from 'react';
import Comment from '../containers/Comment';
import Editor from './Editor';
import { Conversation as ConversationType } from '../model';
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
  onCancel?: () => void;

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
      onUserClick,
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
        onUserClick={onUserClick}
        dataProviders={dataProviders}
      />
    ));
  }

  private renderEditor() {
    const { isExpanded, onCancel, meta, dataProviders, user } = this.props;
    const canReply = !!user;

    if (canReply && (isExpanded || !meta)) {
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

  private onSave = async (value: any) => {
    const {
      containerId,
      id,
      localId,
      meta,
      onAddComment,
      onCreateConversation,
    } = this.props;

    if (!id) {
      if (onCreateConversation) {
        onCreateConversation(localId!, containerId, value, meta);
      }
    } else {
      if (onAddComment) {
        onAddComment(id, id, value);
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
