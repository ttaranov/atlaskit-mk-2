export {
  ConversationResourceConfig,
  ConversationResource,
  ResourceProvider,
} from './api/ConversationResource';

export {
  FETCH_CONVERSATIONS,
  FETCH_CONVERSATIONS_SUCCESS,
  ADD_COMMENT,
  ADD_COMMENT_SUCCESS,
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_SUCCESS,
} from './internal/actions';

export { default as Comment } from './containers/Comment';
export { default as Conversation } from './containers/Conversation';
