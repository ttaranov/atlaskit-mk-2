import * as React from 'react';
import { shallow } from 'enzyme';
import {
  mockConversation,
  MOCK_USERS,
} from '../../../../example-helpers/MockData';
import Conversation from '../../../components/Conversation';
import Editor from '../../../components/Editor';
import CommentContainer from '../../../containers/Comment';
import { AnalyticsEvent } from '../../../internal/analytics';

const containerId = 'ari:cloud:platform::conversation/demo';
const { comments } = mockConversation;
const [user] = MOCK_USERS;

describe('Conversation', () => {
  const defaultProps = {
    createAnalyticsEvent: (event: object): AnalyticsEvent => ({
      update: (attributes: object) => {},
      fire: (channel: string) => {},
      attributes: { foo: 'bar' },
    }),
    sendAnalyticsEvent: () => {},
  };

  const conversation = shallow(
    <Conversation
      {...defaultProps}
      containerId={containerId}
      conversation={mockConversation}
      comments={comments}
      user={user}
    />,
  );

  describe('comments', () => {
    it('should render comments if any', () => {
      // @ts-ignore
      expect(conversation.find(CommentContainer).length).toBe(comments.length);
    });
  });

  describe('beforeUnload behavior', () => {
    let conversationWithWarning;

    beforeEach(() => {
      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();
    });

    beforeAll(() => {
      conversationWithWarning = shallow(
        <Conversation
          {...defaultProps}
          containerId={containerId}
          conversation={mockConversation}
          comments={comments}
          user={user}
          isExpanded={true}
          showBeforeUnloadWarning={true}
        />,
      );
    });

    it('should add a beforeunload event listener when an editor is open', () => {
      conversationWithWarning.setState({ openEditorCount: 1 });
      conversationWithWarning.update();
      expect(window.addEventListener).toHaveBeenCalled();
    });

    it('should remove the beforeunload event listener when no editors are opened', () => {
      conversationWithWarning.setState({ openEditorCount: 1 });
      conversationWithWarning.update();
      conversationWithWarning.setState({ openEditorCount: 0 });
      conversationWithWarning.update();
      expect(window.removeEventListener).toHaveBeenCalled();
    });
  });

  describe('editor', () => {
    it('should render if meta is not set', () => {
      expect(conversation.find(Editor).length).toBe(1);
    });

    it('should not render if meta is set', () => {
      const conversation = shallow(
        <Conversation
          {...defaultProps}
          containerId={containerId}
          meta={{ test: 'testing' }}
          user={user}
        />,
      );
      expect(conversation.find(Editor).length).toBe(0);
    });

    it('should render if isExpanded is true', () => {
      const conversation = shallow(
        <Conversation
          {...defaultProps}
          containerId={containerId}
          meta={{ test: 'testing' }}
          isExpanded={true}
          user={user}
        />,
      );
      expect(conversation.find(Editor).length).toBe(1);
    });

    describe('no user', () => {
      it('should not render if meta is not set', () => {
        const conversation = shallow(
          <Conversation {...defaultProps} containerId={containerId} />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });

      it('should not render if meta is set', () => {
        const conversation = shallow(
          <Conversation
            {...defaultProps}
            containerId={containerId}
            meta={{ test: 'testing' }}
          />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });

      it('should not render if isExpanded is true', () => {
        const conversation = shallow(
          <Conversation
            {...defaultProps}
            containerId={containerId}
            meta={{ test: 'testing' }}
            isExpanded={true}
          />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });
    });
  });
});
