import * as React from 'react';
import { connect } from 'react-redux';
import { SharedProps } from '../components/Comment';
import { Comment as CommentType } from '../model';
import { getComments } from '../internal/selectors';
import { State } from '../internal/store';

export interface Props extends SharedProps {
  comment: CommentType;
  conversationId: string;
  renderComment: (props: any) => JSX.Element;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const comments = getComments(
    state,
    ownProps.conversationId,
    ownProps.comment.commentId,
  );

  return {
    ...ownProps,
    comments,
  };
};

class CommentContainer extends React.Component<
  Props & { comments: CommentType[] },
  {}
> {
  render() {
    const { renderComment, ...props } = this.props;
    return renderComment(props);
  }
}

export default connect(mapStateToProps)(CommentContainer);
