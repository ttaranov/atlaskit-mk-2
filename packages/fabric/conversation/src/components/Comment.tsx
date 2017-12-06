import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import AkAvatar from '@atlaskit/avatar';
import AkComment, {
  CommentAuthor,
  CommentAction,
  CommentTime,
} from '@atlaskit/comment';
import { ReactRenderer } from '@atlaskit/renderer';
import Editor from './Editor';
import { ResourceProvider } from '../api/ConversationResource';
import { Comment as CommentType } from '../model';

export interface Props {
  conversationId: string;
  comment: CommentType;
}

export interface State {
  comment: CommentType;
  isEditing?: boolean;
  isReplying?: boolean;
}

export default class Comment extends React.PureComponent<Props, State> {
  context: { userId: string; provider: ResourceProvider };

  static contextTypes = {
    userId: PropTypes.string,
    provider: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      comment: props.comment,
    };
  }

  private onEdit = () => {
    this.setState({
      isEditing: true,
    });
  };

  private onCancelEdit = () => {
    this.setState({
      isEditing: false,
    });
  };

  private onSaveEdit = async (value: any) => {
    const { provider } = this.context;
    const { comment: { id }, conversationId } = this.props;

    const { document } = await provider.updateComment(
      conversationId,
      id,
      value,
    );

    this.setState((state: State) => {
      const { comment } = state;
      comment.document = document;
      return {
        comment,
        isEditing: false,
      };
    });
  };

  private onReply = () => {
    this.setState({
      isReplying: true,
    });
  };

  private onCancelReply = () => {
    this.setState({
      isReplying: false,
    });
  };

  private onSaveReply = async (value: any) => {
    const { provider } = this.context;
    const { comment: { id }, conversationId } = this.props;
    const newComment = await provider.addComment(conversationId, id, value);

    this.setState((state: State) => {
      const { comment } = state;
      comment.children = [...(comment.children || []), newComment];
      return {
        comment,
        isReplying: false,
      };
    });
  };

  private getContent() {
    const { comment, isEditing } = this.state;

    if (isEditing) {
      return (
        <Editor
          defaultValue={comment.document}
          isExpanded={true}
          onSave={this.onSaveEdit}
          onCancel={this.onCancelEdit}
        />
      );
    }

    return <ReactRenderer document={comment.document} />;
  }

  render() {
    const { userId } = this.context;
    const { conversationId } = this.props;
    const { comment, isReplying } = this.state;
    const { createdBy } = comment;

    let actions = [
      <CommentAction key="reply" onClick={this.onReply}>
        Reply
      </CommentAction>,
    ];

    if (createdBy && userId === createdBy.id) {
      actions = [
        ...actions,
        <CommentAction key="edit" onClick={this.onEdit}>
          Edit
        </CommentAction>,
      ];
    }

    const { children } = comment;

    return (
      <div>
        <AkComment
          author={<CommentAuthor>{createdBy && createdBy.name}</CommentAuthor>}
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
          {(children || []).map(child => (
            <Comment
              key={child.id}
              comment={child}
              conversationId={conversationId}
            />
          ))}
          {isReplying && (
            <Editor
              isExpanded={true}
              onCancel={this.onCancelReply}
              onSave={this.onSaveReply}
            />
          )}
        </AkComment>
      </div>
    );
  }
}
