import { Comment, Conversation, User } from '../src/model';

export const MOCK_USERS: User[] = [
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user',
    name: 'Mock User 1',
    avatarUrl: 'https://api.adorable.io/avatars/80/mockuser.png',
  },
  {
    id: 'ari:cloud:identity::user/3f000e23-3588-4e5d-aa4b-99mock_user2',
    name: 'Mock User 2',
    avatarUrl: 'https://api.adorable.io/avatars/80/mockuser.png',
  },
  {
    id: undefined,
    name: 'Undefined',
  },
];

export const mockComment: Comment = {
  commentId: 'mock-comment-1',
  conversationId: 'mock-conversation',
  createdBy: MOCK_USERS[0],
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
  createdBy: MOCK_USERS[0],
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
  createdBy: MOCK_USERS[1],
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
