import * as React from 'react';
import { shallow } from 'enzyme';
import AkAvatar from '@atlaskit/avatar';
import AkComment, { CommentAuthor } from '@atlaskit/comment';
import { mockComment, mockInlineComment } from '../../example-helpers/MockData';
import Comment from '../../src/components/Comment';
import Editor from '../../src/components/Editor';
import CommentContainer from '../../src/containers/Comment';

describe('Comment', () => {
  const comment = shallow(
    <Comment
      conversationId={mockComment.conversationId}
      comment={mockComment}
    />,
  );

  it('should render as AkComment', () => {
    expect(comment.first().is(AkComment)).toBe(true);
  });

  it('should render author', () => {
    expect(comment.first().props()).toHaveProperty(
      'author',
      <CommentAuthor>{mockComment.createdBy.name}</CommentAuthor>,
    );
  });

  it('should render avatar', () => {
    expect(comment.first().props()).toHaveProperty(
      'avatar',
      <AkAvatar src={mockComment.createdBy.avatarUrl} />,
    );
  });

  it('should render editor in reply-mode', () => {
    comment.setState({
      isReplying: true,
    });

    expect(comment.find(Editor).length).toBe(1);
  });

  it('should render child-comments if any', () => {
    const comment = shallow(
      <Comment
        conversationId={mockComment.conversationId}
        comment={mockComment}
        comments={[mockInlineComment]}
      />,
    );

    expect(comment.first().find(CommentContainer).length).toBe(1);
  });
});
