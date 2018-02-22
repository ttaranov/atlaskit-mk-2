import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ResourceProvider } from '../api/ConversationResource';
import Conversation from '../components/Conversation';
import { connect, withProvider, Dispatch } from '../internal/connect';
import {
  addComment,
  updateComment,
  deleteComment,
  revertComment,
  updateUser,
  createConversation,
} from '../internal/actions';
import { getComments, getConversation, getUser } from '../internal/selectors';
import { uuid } from '../internal/uuid';
import { State } from '../internal/store';
import { User } from '../model';

export interface Props {
  id?: string;
  localId: string;
  containerId: string;
  dataProviders?: ProviderFactory;
  meta?: {
    [key: string]: any;
  };
  isExpanded?: boolean;
  onCancel?: () => void;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const { id, localId, containerId } = ownProps;
  const conversation = getConversation(state, id || localId);
  const comments = getComments(state, id || localId);
  const user = getUser(state);

  return {
    conversation,
    comments,
    containerId,
    user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAddComment(
    conversationId: string,
    parentId: string,
    value: any,
    localId?: string,
  ) {
    dispatch(addComment(conversationId, parentId, value, localId));
  },

  onUpdateComment(conversationId: string, commentId: string, value: any) {
    dispatch(updateComment(conversationId, commentId, value));
  },

  onDeleteComment(conversationId: string, commentId: string) {
    dispatch(deleteComment(conversationId, commentId));
  },

  onRevertComment(conversationId: string, commentId: string) {
    dispatch(revertComment(conversationId, commentId));
  },

  onUpdateUser(user: User) {
    dispatch(updateUser(user));
  },

  onCreateConversation(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ) {
    dispatch(createConversation(localId, containerId, value, meta));
  },
});

const ResourcedConversation = withProvider(
  connect(mapStateToProps, mapDispatchToProps)(Conversation),
);

export interface ContainerProps {
  id?: string;
  containerId: string;
  provider: ResourceProvider;
  dataProviders?: ProviderFactory;
  meta?: {
    [key: string]: any;
  };
  isExpanded?: boolean;
  onCancel?: () => void;
}

class ConversationContainer extends React.Component<ContainerProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      localId: props.id || uuid.generate(),
    };
  }

  render() {
    const { props, state: { localId } } = this;
    return <ResourcedConversation {...props} localId={localId} />;
  }
}

export default ConversationContainer;
