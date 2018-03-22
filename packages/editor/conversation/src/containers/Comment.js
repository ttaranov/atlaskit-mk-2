// @flow
import { Component } from 'react';
import type { Node as ReactNode } from 'react';
import { connect } from 'react-redux';
import type { SharedProps } from '../components/Comment';
import type { Comment as CommentType } from '../model';
import { getComments } from '../internal/selectors';
import type { State } from '../internal/store';

export type Props = SharedProps & {
  comment: CommentType,
  conversationId: string,
  containerId?: string,
  renderComment: (props: any) => ReactNode,
};

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

class CommentContainer extends Component<
  Props & { comments: CommentType[] },
  {},
> {
  render() {
    const { renderComment, ...props } = this.props;
    return renderComment(props);
  }
}

export default connect(mapStateToProps)(CommentContainer);
