import * as React from 'react';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import AkAvatar from '@atlaskit/avatar';
import AkComment, {
  CommentAuthor,
  CommentAction,
  CommentTime,
} from '@atlaskit/comment';
import { ReactRenderer } from '@atlaskit/renderer';
import Editor from './Editor';
import { Comment as CommentType, User } from '../model';
import CommentContainer from '../containers/Comment';
import { ProviderFactory } from '@atlaskit/editor-common';

/**
 * Props which are passed down from the parent Conversation/Comment
 */
export interface SharedProps {
  user?: User;
  comments?: CommentType[];

  // Dispatch
  onAddComment?: (conversationId: string, parentId: string, value: any) => void;
  onUpdateComment?: (
    conversationId: string,
    commentId: string,
    value: any,
  ) => void;
  onDeleteComment?: (conversationId: string, commentId: string) => void;

  // Provider
  dataProviders?: ProviderFactory;

  // Event Hooks
  onUserClick?: (user: User) => void;
}

export interface Props extends SharedProps {
  conversationId: string;
  comment: CommentType;
}

export interface State {
  isEditing?: boolean;
  isReplying?: boolean;
}

export const DeletedMessage = () => <em>Comment deleted by the author</em>;

export default class Comment extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  private onReply = () => {
    this.setState({
      isReplying: true,
    });
  };

  private onSaveReply = async (value: any) => {
    const { conversationId, comment, onAddComment } = this.props;

    if (!onAddComment) {
      return;
    }

    onAddComment(conversationId, comment.commentId, value);

    this.setState({
      isReplying: false,
    });
  };

  private onCancelReply = () => {
    this.setState({
      isReplying: false,
    });
  };

  private onDelete = () => {
    const { onDeleteComment, conversationId, comment } = this.props;

    if (!onDeleteComment) {
      return;
    }

    onDeleteComment(conversationId, comment.commentId);
  };

  private onEdit = () => {
    this.setState({
      isEditing: true,
    });
  };

  private onSaveEdit = async (value: any) => {
    const { conversationId, comment, onUpdateComment } = this.props;

    if (!onUpdateComment) {
      return;
    }

    onUpdateComment(conversationId, comment.commentId, value);

    this.setState({
      isEditing: false,
    });
  };

  private onCancelEdit = () => {
    this.setState({
      isEditing: false,
    });
  };

  /**
   * Username click handler - pass a User object, returns a handler which will invoke onUserClick with it
   * @param {User} user
   */
  private handleUserClick = (user: User) => () => {
    const { onUserClick } = this.props;
    if (onUserClick && typeof onUserClick === 'function') {
      onUserClick(user);
    }
  };

  private getContent() {
    const { comment, dataProviders } = this.props;
    const { isEditing } = this.state;

    if (comment.deleted) {
      return <DeletedMessage />;
    }

    if (isEditing) {
      return (
        <Editor
          defaultValue={comment.document.adf}
          isExpanded={true}
          isEditing={isEditing}
          onSave={this.onSaveEdit}
          onCancel={this.onCancelEdit}
          dataProviders={dataProviders}
        />
      );
    }

    return (
      <ReactRenderer
        document={comment.document.adf}
        dataProviders={dataProviders}
      />
    );
  }

  render() {
    const {
      conversationId,
      comment,
      comments,
      user,
      dataProviders,
      onUserClick,
    } = this.props;
    const { isReplying, isEditing } = this.state;
    const { createdBy } = comment;
    let actions;

    if (!isEditing && !comment.deleted) {
      actions = [
        <CommentAction key="reply" onClick={this.onReply}>
          Reply
        </CommentAction>,
      ];

      if (createdBy && user && user.id === createdBy.id) {
        actions = [
          ...actions,
          <CommentAction key="edit" onClick={this.onEdit}>
            Edit
          </CommentAction>,
          <CommentAction key="delete" onClick={this.onDelete}>
            Delete
          </CommentAction>,
        ];
      }
    }

    return (
      <AkComment
        author={
          // Render with onClick/href if there's an onUserClick handler
          onUserClick ? (
            <CommentAuthor
              onClick={this.handleUserClick(createdBy)}
              href={createdBy.profileUrl || '#'}
            >
              {createdBy && createdBy.name}
            </CommentAuthor>
          ) : (
            // Otherwise just render text
            <CommentAuthor>{createdBy && createdBy.name}</CommentAuthor>
          )
        }
        avatar={<AkAvatar src={createdBy && createdBy.avatarUrl} />}
        time={
          <CommentTime>
            {distanceInWordsToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </CommentTime>
        }
        actions={actions}
        content={this.getContent()}
      >
        {(comments || []).map(child => (
          <CommentContainer
            key={child.commentId}
            comment={child}
            user={user}
            conversationId={conversationId}
            onAddComment={this.props.onAddComment}
            onUpdateComment={this.props.onUpdateComment}
            onDeleteComment={this.props.onDeleteComment}
            onUserClick={onUserClick}
            dataProviders={dataProviders}
          />
        ))}
        {isReplying && (
          <Editor
            isExpanded={true}
            onCancel={this.onCancelReply}
            onSave={this.onSaveReply}
            dataProviders={dataProviders}
          />
        )}
      </AkComment>
    );
  }
}
