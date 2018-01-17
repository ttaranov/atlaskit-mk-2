import * as React from 'react';
import Comment from '../containers/Comment';
import Editor from './Editor';
import {
  Comment as CommentType,
  Conversation as ConversationType,
  User,
} from '../model';
import { ProviderFactory } from '@atlaskit/editor-common';

export interface Props {
  id?: string;
  localId?: string;
  conversation?: ConversationType;
  containerId: string;
  comments?: CommentType[];
  user?: User;
  onAddComment?: (conversationId: string, parentId: string, value: any) => void;
  onUpdateComment?: (
    conversationId: string,
    commentId: string,
    value: any,
  ) => void;
  onDeleteComment?: (conversationId: string, commentId: string) => void;
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

  // Provider
  dataProviders?: ProviderFactory;
}

export default class Conversation extends React.PureComponent<Props> {
  private renderComments() {
    const {
      comments,
      conversation,
      onAddComment,
      onUpdateComment,
      onDeleteComment,
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
        dataProviders={dataProviders}
      />
    ));
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
    const { isExpanded, onCancel, meta, dataProviders } = this.props;

    return (
      <div>
        {this.renderComments()}
        {isExpanded || !meta ? (
          <Editor
            isExpanded={isExpanded}
            onSave={this.onSave}
            onCancel={onCancel}
            dataProviders={dataProviders}
          />
        ) : null}
      </div>
    );
  }
}
