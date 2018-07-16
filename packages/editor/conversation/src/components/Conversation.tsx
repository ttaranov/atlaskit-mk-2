import * as React from 'react';
import CommentContainer from '../containers/Comment';
import Comment from '../components/Comment';
import Editor from './Editor';
import { Conversation as ConversationType } from '../model';
import { SharedProps } from './Comment';

// See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
// https://developer.mozilla.org/en-US/docs/Web/API/Event/returnValue
interface UnloadEvent extends Event {
  returnValue: any;
}

// This is a stop-gap for preventing the user from losing their work. Eventually
// this will be replaced with drafts/auto-save functionality
function beforeUnloadHandler(e: UnloadEvent) {
  // The beforeUnload dialog is implemented inconsistenly.
  // The following is the most cross-browser approach.
  const confirmationMessage =
    'You have an unsaved comment. Are you sure you want to leave without saving?';
  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome <34
}

export interface Props extends SharedProps {
  id?: string;
  localId?: string;
  conversation?: ConversationType;
  containerId: string;
  showBeforeUnloadWarning?: boolean;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;

  // Dispatch
  onCreateConversation?: (
    localId: string,
    containerId: string,
    value: any,
    meta: any,
  ) => void;

  isExpanded?: boolean;
  meta?: {
    [key: string]: any;
  };
}

export interface State {
  openEditorCount: number;
}

export default class Conversation extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openEditorCount: 0,
    };
  }

  static defaultProps = {
    placeholder: 'What do you want to say?',
  };

  private renderComments() {
    const {
      comments,
      conversation,
      onAddComment,
      onUpdateComment,
      onDeleteComment,
      onRevertComment,
      onHighlightComment,
      onUserClick,
      onCancel,
      user,
      dataProviders,
      renderEditor,
      containerId,
      placeholder,
      disableScrollTo,
    } = this.props;

    if (!conversation) {
      return;
    }

    const { conversationId } = conversation;

    return (comments || []).map(comment => (
      <CommentContainer
        key={comment.commentId}
        conversationId={conversationId}
        comment={comment}
        user={user}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onRevertComment={onRevertComment}
        onEditorOpen={this.onEditorOpen}
        onEditorClose={this.onEditorClose}
        onHighlightComment={onHighlightComment}
        onRetry={this.onRetry(comment.document)}
        onCancel={onCancel}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
        renderComment={props => <Comment {...props} />}
        renderEditor={renderEditor}
        containerId={containerId}
        placeholder={placeholder}
        disableScrollTo={disableScrollTo}
      />
    ));
  }

  private renderEditor() {
    const {
      isExpanded,
      onCancel,
      meta,
      dataProviders,
      user,
      conversation,
      renderEditor,
      placeholder,
      disableScrollTo,
      allowFeedbackAndHelpButtons,
    } = this.props;
    const isInline = !!meta;
    const hasConversation = !!conversation;
    const canReply = !!user && (!isInline || (isExpanded && !hasConversation));

    if (canReply) {
      return (
        <Editor
          isExpanded={isExpanded}
          onSave={this.onSave}
          onCancel={onCancel}
          onOpen={this.onEditorOpen}
          onClose={this.onEditorClose}
          dataProviders={dataProviders}
          user={user}
          renderEditor={renderEditor}
          placeholder={placeholder}
          disableScrollTo={disableScrollTo}
          allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
        />
      );
    }
  }

  private onRetry = (document: any) => (commentLocalId?: string) => {
    this.onSave(document, commentLocalId);
  };

  private onSave = async (value: any, commentLocalId?: string) => {
    const {
      containerId,
      id,
      localId,
      meta,
      onAddComment,
      onCreateConversation,
      conversation,
    } = this.props;

    if (!id && !commentLocalId) {
      if (onCreateConversation) {
        onCreateConversation(localId!, containerId, value, meta);
      }
    } else {
      if (onAddComment) {
        const conversationId = id || conversation!.conversationId;
        onAddComment(conversationId, conversationId, value, commentLocalId);
      }
    }
  };

  private onEditorClose = () => {
    if (this.state.openEditorCount > 0) {
      this.setState({
        openEditorCount: this.state.openEditorCount - 1,
      });
    }
  };

  private onEditorOpen = () => {
    this.setState({
      openEditorCount: this.state.openEditorCount + 1,
    });
  };

  componentDidUpdate() {
    if (this.props.showBeforeUnloadWarning) {
      if (this.state.openEditorCount === 0) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      } else if (this.state.openEditorCount === 1) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.showBeforeUnloadWarning) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  }

  render() {
    return (
      <>
        {this.renderComments()}
        {this.renderEditor()}
      </>
    );
  }
}
