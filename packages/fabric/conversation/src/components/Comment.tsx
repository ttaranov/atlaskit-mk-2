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
import { HttpError } from '../api/HttpError';

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
  onRevertComment?: (comment: CommentType) => void;
  onCancelComment?: (comment: CommentType) => void;

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
  lastDispatch?: {
    handler: any;
    args: any[];
  };
}

export const DeletedMessage = () => <em>Comment deleted by the author</em>;

const commentChanged = (oldComment: CommentType, newComment: CommentType) => {
  if (oldComment.state !== newComment.state) {
    return true;
  }

  if (oldComment.deleted !== newComment.deleted) {
    return true;
  }

  return false;
};

export default class Comment extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const {isEditing, isReplying} = this.state;

    if (
      nextState.isEditing !== isEditing ||
      nextState.isReplying !== isReplying
    ) {
      return true;
    }

    if (commentChanged(this.props.comment, nextProps.comment)) {
      return true;
    }

    const {comments: oldComments = []} = this.props;
    const {comments: newComments = []} = nextProps;

    if (oldComments.length !== newComments.length) {
      return true;
    }

    if (
      newComments.some(comment => {
        const [oldComment] = oldComments.filter(
          c =>
            c.commentId === comment.commentId || c.localId === comment.localId,
        );
        return commentChanged(oldComment, comment);
      })
    ) {
      return true;
    }

    return false;
  }

  private dispatch(dispatch: string, ...args) {
    const handler = this.props[dispatch];

    if (handler) {
      handler.apply(handler, args);

      this.setState({
        lastDispatch: { handler: dispatch, args },
      });
    }
  }

  private onReply = () => {
    this.setState({
      isReplying: true,
    });
  };

  private onSaveReply = async (value: any) => {
    const { conversationId, comment } = this.props;

    this.dispatch('onAddComment', conversationId, comment.commentId, value);

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
    const { conversationId, comment } = this.props;

    this.dispatch('onDeleteComment', conversationId, comment.commentId);
  };

  private onEdit = () => {
    this.setState({
      isEditing: true,
    });
  };

  private onSaveEdit = async (value: any) => {
    const { conversationId, comment } = this.props;

    this.dispatch('onUpdateComment', conversationId, comment.commentId, value);

    this.setState({
      isEditing: false,
    });
  };

  private onCancelEdit = () => {
    this.setState({
      isEditing: false,
    });
  };

  private onRequestCancel = () => {
    const { comment } = this.props;
    this.dispatch('onRevertComment', comment);
  };

  private onRequestRetry = () => {
    const { lastDispatch } = this.state;

    if (!lastDispatch) {
      return;
    }

    this.dispatch(lastDispatch.handler, ...lastDispatch.args);
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
    const { comment, dataProviders, user } = this.props;
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
          user={user}
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

  private renderComments() {
    const {
      comments,
      conversationId,
      user,
      onUserClick,
      dataProviders,
    } = this.props;

    if (!comments || comments.length === 0) {
      return null;
    }

    return comments.map(child => (
      <CommentContainer
        key={child.commentId}
        comment={child}
        user={user}
        conversationId={conversationId}
        onAddComment={this.props.onAddComment}
        onUpdateComment={this.props.onUpdateComment}
        onDeleteComment={this.props.onDeleteComment}
        onRevertComment={this.props.onRevertComment}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
      />
    ));
  }

  private renderEditor() {
    const { isReplying } = this.state;
    if (!isReplying) {
      return null;
    }

    const { dataProviders, user } = this.props;

    return (
      <Editor
        isExpanded={true}
        onCancel={this.onCancelReply}
        onSave={this.onSaveReply}
        dataProviders={dataProviders}
        user={user}
      />
    );
  }

  render() {
    const { comment, user, onUserClick } = this.props;
    const { isEditing } = this.state;
    const { createdBy, state: commentState, error } = comment;
    const canReply = !!user && !isEditing && !comment.deleted;
    const errorProps: {
      actions?: any[];
      message?: string;
    } = {};
    let actions;

    if (canReply) {
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

    if (error) {
      errorProps.actions = [];

      if ((error as HttpError).canRetry) {
        errorProps.actions = [
          <CommentAction key="retry" onClick={this.onRequestRetry}>
            Retry
          </CommentAction>,
        ];
      }

      errorProps.actions = [
        ...errorProps.actions,
        <CommentAction key="cancel" onClick={this.onRequestCancel}>
          Cancel
        </CommentAction>,
      ];

      errorProps.message = error.message;
    }

    const comments = this.renderComments();
    const editor = this.renderEditor();

    return (
      <AkComment
        author={
          // Render with onClick/href if they're supplied
          onUserClick || createdBy.profileUrl ? (
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
        isSaving={commentState === 'SAVING'}
        isError={commentState === 'ERROR'}
        errorActions={errorProps.actions}
        errorIconLabel={errorProps.message}
      >
        {editor || comments ? (
          <div>
            {comments}
            {editor}
          </div>
        ) : null}
      </AkComment>
    );
  }
}
