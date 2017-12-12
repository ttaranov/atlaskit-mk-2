import { Comment, Conversation, User } from '../src/model';

export const mockUser: User = {
  id: 'mock-user',
  name: 'Mock User',
  avatarUrl: 'https://api.adorable.io/avatars/80/mockuser.png',
};

export const mockConversation: Conversation = {
  id: 'mock-conversation',
  containerId: 'abc:abc:abc/demo',
  children: [
    {
      id: 'mock-comment-1',
      createdBy: mockUser,
      createdAt: Date.now(),
      document: {
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
  ],
};

export const mockInlineConversation: Conversation = {
  id: 'mock-inline-conversation',
  containerId: 'abc:abc:abc/demo',
  children: [
    {
      id: 'mock-comment-2',
      createdBy: mockUser,
      createdAt: Date.now(),
      document: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Made you should actually do something here?',
              },
            ],
          },
        ],
      },
    },
  ],
};
