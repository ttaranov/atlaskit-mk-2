import {
  ConversationResourceConfig,
  ResourceProvider,
} from '../src/api/ConversationResource';
import { Comment, Conversation, User } from '../src/model';
import { mockConversation, mockInlineConversation, mockUser } from './MockData';

export class MockProvider implements ResourceProvider {
  private config: ConversationResourceConfig;
  private conversations: Map<string, Conversation> = new Map();

  constructor(config: ConversationResourceConfig) {
    this.config = config;
    this.conversations.set('mock-conversation', mockConversation);
    this.conversations.set('mock-inline-conversation', mockInlineConversation);
  }

  async getConversations(): Promise<any> {
    return [
      { id: 'mock-conversation', meta: null },
      {
        id: 'mock-inline-conversation',
        meta: { name: 'main.js', lineNumber: 3 },
      },
    ];
  }

  async getConversation(id: string): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    return Promise.resolve(conversation);
  }

  async create(meta: any): Promise<Conversation> {
    const { externalId } = this.config;

    const conversation = {
      id: `conversation-${Math.floor(Math.random() * 1000)}-${Math.floor(
        Math.random() * 1000,
      )}`,
      externalId: externalId,
      children: [],
    };

    this.conversations.set(conversation.id, conversation);
    return Promise.resolve(conversation);
  }

  async addComment(conversationId: string, parentId: string, document: any) {
    const { externalId } = this.config;
    const comment: Comment = {
      document,
      externalId,
      createdBy: mockUser,
      createdAt: Date.now(),
      id: `comment-${Math.floor(Math.random() * 1000)}-${Math.floor(
        Math.random() * 1000,
      )}`,
    };

    return Promise.resolve(comment);
  }

  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<any> {
    return Promise.resolve({ document });
  }
}
