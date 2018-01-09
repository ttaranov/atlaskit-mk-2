import * as React from 'react';
// import * as sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import AkAvatar from '@atlaskit/avatar';
import AkComment, { CommentAuthor, CommentAction } from '@atlaskit/comment';
import {
  mockComment,
  mockInlineComment,
  MOCK_USERS,
} from '../../example-helpers/MockData';
import Comment from '../../src/components/Comment';
import Editor from '../../src/components/Editor';
import CommentContainer from '../../src/containers/Comment';

describe('Comment', () => {
  let comment;

  describe('rendering', () => {
    beforeEach(() => {
      comment = shallow(
        <Comment
          conversationId={mockComment.conversationId}
          comment={mockComment}
        />,
      );
    });

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

  describe('edit link', () => {
    let user;
    let editLink;

    beforeEach(() => {
      user = MOCK_USERS[0];

      comment = mount(
        <Comment
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
        />,
      );

      editLink = comment
        .first()
        .find(CommentAction)
        .findWhere(item => item.text() === 'Edit')
        .first();
    });

    it('should be shown for comments by the logged in user only', () => {
      expect(editLink.length).toEqual(1);

      // Mount another component to verify a different user doesn't get the edit button
      const otherUser = MOCK_USERS[1];
      const secondComment = mount(
        <Comment
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={otherUser}
        />,
      );
      const secondCommentEditLink = secondComment
        .first()
        .find(CommentAction)
        .findWhere(item => item.text() === 'Edit')
        .first();

      expect(secondCommentEditLink.length).toEqual(0);
    });

    it('should show an editor when clicked', () => {
      expect(comment.find(Editor).length).toBe(0);
      editLink.simulate('click');
      expect(comment.find(Editor).length).toBe(1);
    });
  });
});
