import * as React from 'react';
import { shallow } from 'enzyme';
import { mockConversation } from '../../example-helpers/MockData';
import Conversation from '../../src/components/Conversation';
import Editor from '../../src/components/Editor';
import CommentContainer from '../../src/containers/Comment';

const containerId = 'abc:abc:abc/demo';
const { comments } = mockConversation;

describe('Conversation', () => {
  const conversation = shallow(
    <Conversation
      containerId={containerId}
      conversation={mockConversation}
      comments={comments}
    />,
  );

  describe('comments', () => {
    it('should render comments if any', () => {
      expect(conversation.find(CommentContainer).length).toBe(comments.length);
    });
  });

  describe('editor', () => {
    it('should render if meta is not set', () => {
      expect(conversation.find(Editor).length).toBe(1);
    });

    it('should not render if meta is set', () => {
      const conversation = shallow(
        <Conversation containerId={containerId} meta={{ test: 'testing' }} />,
      );
      expect(conversation.find(Editor).length).toBe(0);
    });

    it('should render if isExpanded is true', () => {
      const conversation = shallow(
        <Conversation
          containerId={containerId}
          meta={{ test: 'testing' }}
          isExpanded={true}
        />,
      );
      expect(conversation.find(Editor).length).toBe(1);
    });
  });
});
