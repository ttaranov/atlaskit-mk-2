import * as React from 'react';
import CommentContainer from '../containers/Comment';
import Comment from '../components/Comment';
import Editor from './Editor';
import { Conversation as ConversationType } from '../model';
import { SharedProps, SendAnalyticsEvent } from './types';
import {
  createAnalyticsEvent,
  actionSubjectIds,
  fireEvent,
  trackEventActions,
  eventTypes,
} from '../internal/analytics';
import { SuccessHandler } from '../internal/actions';

// See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
// https://developer.mozilla.org/en-US/docs/Web/API/Event/returnValue
interface UnloadEvent extends Event {
  returnValue: any;
}

// This is a stop-gap for preventing the user from losing their work. Eventually
// this will be replaced with drafts/auto-save functionality
function beforeUnloadHandler(e: UnloadEvent) {
  // The beforeUnload dialog is implemented inconsistently.
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

  // Dispatch
  onCreateConversation?: (
    localId: string,
    containerId: string,
    value: any,
    meta: any,
    onSuccess?: SuccessHandler,
  ) => void;

  isExpanded?: boolean;
  meta?: {
    [key: string]: any;
  };
  createAnalyticsEvent: createAnalyticsEvent;
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

  /*
    TODO: Remove me when editor is instrumented
    Only use this method when instrumenting something that isn't instrumented itself (like Editor)
    Once editor is instrumented use the analyticsEvent passed in by editor instead.

    nestedDepth is always 0 when using the save handlers in this file.
    Because a new comment created on the conversation itself is always going to be the top comment.

    @deprecated
  */
  sendEditorAnalyticsEvent: SendAnalyticsEvent = eventData => {
    const { createAnalyticsEvent, containerId } = this.props;

    const analyticsEvent = createAnalyticsEvent({
      actionSubject: 'editor',
      action: 'clicked',
    });

    fireEvent(analyticsEvent, { containerId, ...eventData });
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
      allowFeedbackAndHelpButtons,
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
        onEditorChange={this.handleEditorChange}
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
        sendAnalyticsEvent={this.sendEditorAnalyticsEvent}
        allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
      />
    ));
  }

  private onCancel = () => {
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.cancelButton,
    });

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  private onOpen = () => {
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.createCommentInput,
    });
    this.onEditorOpen();
  };

  private renderConversationsEditor() {
    const {
      isExpanded,
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
          onCancel={this.onCancel}
          onOpen={this.onOpen}
          onClose={this.onEditorClose}
          onChange={this.handleEditorChange}
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
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.retryFailedRequestButton,
    });
    this.onSave(document, commentLocalId, true);
  };

  private onSave = async (
    value: any,
    commentLocalId?: string,
    retry?: boolean,
  ) => {
    const {
      containerId,
      id,
      localId,
      meta,
      onAddComment,
      onCreateConversation,
      conversation,
    } = this.props;

    if (!retry) {
      this.sendEditorAnalyticsEvent({
        actionSubjectId: actionSubjectIds.saveButton,
      });
    }

    if (!id && !commentLocalId && onCreateConversation) {
      onCreateConversation(localId!, containerId, value, meta, id => {
        this.sendEditorAnalyticsEvent({
          actionSubjectId: id,
          eventType: eventTypes.TRACK,
          attributes: {
            nestedDepth: 0,
          },
          action: trackEventActions.created,
          actionSubject: 'comment',
        });
      });
    } else if (onAddComment) {
      const conversationId = id || conversation!.conversationId;
      onAddComment(
        conversationId,
        conversationId,
        value,
        commentLocalId,
        id => {
          this.sendEditorAnalyticsEvent({
            actionSubjectId: id,
            eventType: eventTypes.TRACK,
            attributes: {
              nestedDepth: 0,
            },
            action: trackEventActions.created,
            actionSubject: 'comment',
          });
        },
      );
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

  private handleEditorChange = (value: any, commentId?: string) => {
    const { id, localId, containerId, onEditorChange, meta } = this.props;

    if (onEditorChange) {
      const isLocal = !id;
      onEditorChange(isLocal, value, localId!, commentId, containerId, meta);
    }
  };

  componentDidUpdate() {
    if (!this.props.showBeforeUnloadWarning) {
      return;
    }

    if (this.state.openEditorCount === 0) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    } else if (this.state.openEditorCount === 1) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
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
        {this.renderConversationsEditor()}
      </>
    );
  }
}
