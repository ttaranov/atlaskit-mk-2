import { Comment, Conversation, User } from '../src/model';

export const mockUser: User = {
  id: 'mock-user',
  name: 'Mock User',
  avatarUrl: 'https://api.adorable.io/avatars/80/mockuser.png',
};

export const mockComment: Comment = {
  commentId: 'mock-comment-1',
  conversationId: 'mock-conversation',
  createdBy: mockUser,
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        },
      ],
    },
  },
};

export const mockInlineComment: Comment = {
  commentId: 'mock-comment-2',
  conversationId: 'mock-inline-conversation',
  createdBy: mockUser,
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Maybe you should actually do something here?',
            },
          ],
        },
      ],
    },
  },
};

export const mockReplyComment: Comment = {
  commentId: 'mock-reply-comment-1',
  parentId: 'mock-comment-1',
  conversationId: 'mock-conversation',
  createdBy: mockUser,
  createdAt: Date.now(),
  document: {
    adf: {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Reply!',
            },
          ],
        },
      ],
    },
  },
};

export const mockConversation: Conversation = {
  conversationId: 'mock-conversation',
  containerId: 'abc:abc:abc/demo',
  comments: [mockComment, mockReplyComment],
  meta: {},
  localId: 'local-conversation',
};

export const mockInlineConversation: Conversation = {
  conversationId: 'mock-inline-conversation',
  containerId: 'abc:abc:abc/demo',
  comments: [mockInlineComment],
  meta: { name: 'main.js', lineNumber: 3 },
};
