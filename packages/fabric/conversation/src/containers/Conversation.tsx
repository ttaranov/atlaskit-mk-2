import * as React from 'react';
import Conversation from '../components/Conversation';
import { connect, withProvider, Dispatch } from '../internal/connect';
import {
  addComment,
  updateComment,
  createConversation,
} from '../internal/actions';
import { getComments, getConversation } from '../internal/selectors';
import { uuid } from '../internal/uuid';
import { State } from '../internal/store';

export interface Props {
  id?: string;
  localId: string;
  containerId: string;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const { id, localId, containerId } = ownProps;
  const conversation = getConversation(state, id || localId);
  const comments = getComments(state, id || localId);

  return {
    conversation,
    comments,
    containerId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAddComment(conversationId: string, parentId: string, value: any) {
    dispatch(addComment(conversationId, parentId, value));
  },

  onUpdateComment(conversationId: string, commentId: string, value: any) {
    dispatch(updateComment(conversationId, commentId, value));
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

class ConversationContainer extends React.Component<any, any> {
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
