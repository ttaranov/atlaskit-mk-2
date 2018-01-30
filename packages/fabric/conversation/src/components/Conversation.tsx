import * as React from 'react';
import CommentContainer from '../containers/Comment';
import Comment from '../components/Comment';
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
      <CommentContainer
        key={comment.commentId}
        conversationId={conversationId}
        comment={comment}
        user={user}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onRevertComment={onRevertComment}
        onRetry={this.onRetry(comment.document)}
        onCancel={onCancel}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
        renderComment={props => <Comment {...props} />}
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

  private onRetry = (document: any) => (commentLocalId?: string) => {
    this.onSave(document, commentLocalId);
  };

  private onSave = async (value: any, commentLocalId?: string) => {
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
      if (onCreateConversation) {
        onCreateConversation(localId!, containerId, value, meta);
      }
    } else {
      if (onAddComment) {
        const conversationId = id || conversation!.conversationId;
        onAddComment(conversationId, conversationId, value, commentLocalId);
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
