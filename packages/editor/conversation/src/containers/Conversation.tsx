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
  SuccessHandler,
  saveDraft,
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
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      addComment(conversationId, parentId, value, localId, provider, onSuccess),
    );
  },

  onUpdateComment(
    conversationId: string,
    commentId: string,
    value: any,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      updateComment(conversationId, commentId, value, provider, onSuccess),
    );
  },

  onDeleteComment(
    conversationId: string,
    commentId: string,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(deleteComment(conversationId, commentId, provider, onSuccess));
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
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      createConversation(
        localId,
        containerId,
        value,
        meta,
        provider,
        onSuccess,
      ),
    );
  },

  onEditorChange(
    isLocal: boolean,
    value: any,
    conversationId: string,
    commentId: string | undefined,
    containerId: string,
    meta: any,
  ) {
    dispatch(
      saveDraft(
        isLocal,
        value,
        conversationId,
        commentId,
        containerId,
        meta,
        provider,
      ),
    );
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
  onEditorChange?: () => void;
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
