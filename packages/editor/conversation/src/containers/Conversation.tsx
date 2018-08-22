import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Editor as AkEditor, EditorProps } from '@atlaskit/editor-core';
import { Provider, connect, Dispatch } from 'react-redux';
import Conversation, { Props as BaseProps } from '../components/Conversation';
import { ResourceProvider } from '../api/ConversationResource';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  addComment,
  updateComment,
  deleteComment,
  revertComment,
  updateUser,
  createConversation,
  HIGHLIGHT_COMMENT,
} from '../internal/actions';
import { getComments, getConversation, getUser } from '../internal/selectors';
import { uuid } from '../internal/uuid';
import { State } from '../internal/store';
import { User } from '../model';

export interface Props extends BaseProps {
  localId: string;
  containerId: string;
  dataProviders?: ProviderFactory;
  meta?: {
    [key: string]: any;
  };
  isExpanded?: boolean;
  onCancel?: () => void;
  provider: ResourceProvider;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const { id, localId, containerId } = ownProps;
  const conversation = getConversation(state, id || localId);
  const comments = getComments(state, id || localId);
  const user = getUser(state);

  return {
    ...ownProps,
    conversation,
    comments,
    containerId,
    user,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<State>,
  { provider }: Props,
) => ({
  onAddComment(
    conversationId: string,
    parentId: string,
    value: any,
    localId?: string,
  ) {
    dispatch(addComment(conversationId, parentId, value, localId, provider));
  },

  onUpdateComment(conversationId: string, commentId: string, value: any) {
    dispatch(updateComment(conversationId, commentId, value, provider));
  },

  onDeleteComment(conversationId: string, commentId: string) {
    dispatch(deleteComment(conversationId, commentId, provider));
  },

  onRevertComment(conversationId: string, commentId: string) {
    dispatch(revertComment(conversationId, commentId, provider));
  },

  onHighlightComment(commentId: string) {
    dispatch({ type: HIGHLIGHT_COMMENT, payload: { commentId } });
  },

  onUpdateUser(user: User) {
    dispatch(updateUser(user, provider));
  },

  onCreateConversation(
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ) {
    dispatch(createConversation(localId, containerId, value, meta, provider));
  },
});

const ResourcedConversation = withAnalyticsEvents()(
  connect(mapStateToProps, mapDispatchToProps)(Conversation as any),
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
  showBeforeUnloadWarning?: boolean;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;
  renderEditor?: (Editor: typeof AkEditor, props: EditorProps) => JSX.Element;
  placeholder?: string;
  disableScrollTo?: boolean;
  allowFeedbackAndHelpButtons?: boolean;
}

class ConversationContainer extends React.Component<ContainerProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      localId: props.id || uuid.generate(),
    };
  }

  render() {
    const {
      props,
      state: { localId },
    } = this;
    const { store } = props.provider;

    return (
      <Provider store={store}>
        <ResourcedConversation {...props} localId={localId} />
      </Provider>
    );
  }
}

export default ConversationContainer;
