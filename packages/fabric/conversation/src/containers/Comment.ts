import Comment from '../components/Comment';
import { Comment as CommentType } from '../model';
import { connect } from '../internal/connect';
import { getComments } from '../internal/selectors';
import { State } from '../internal/store';

export interface Props {
  comment: CommentType;
  conversationId: string;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const comments = getComments(
    state,
    ownProps.conversationId,
    ownProps.comment.commentId,
  );

  return {
    comments,
  };
};

export default connect(mapStateToProps)(Comment);
