/**
 * Props which are passed down from the parent Conversation/Comment
 */
export interface SharedProps {
  user?: User;
  comments?: CommentType[];

  // Dispatch
  onAddComment?: (
    conversationId: string,
    parentId: string,
    value: any,
    localId?: string,
  ) => void;
  onUpdateComment?: (
    conversationId: string,
    commentId: string,
    value: any,
  ) => void;
  onDeleteComment?: (conversationId: string, commentId: string) => void;
  onRevertComment?: (conversationId: string, commentId: string) => void;
  onCancelComment?: (conversationId: string, commentId: string) => void;
  onCancel?: () => void;
  onHighlightComment?: (commentId: string) => void;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;

  // Provider
  dataProviders?: ProviderFactory;

  // Event Hooks
  onUserClick?: (user: User) => void;
  onRetry?: (localId?: string) => void;

  // Editor
  renderEditor?: (Editor: typeof AkEditor, props: EditorProps) => JSX.Element;

  containerId?: string;

  isHighlighted?: boolean;
  placeholder?: string;
  disableScrollTo?: boolean;
  allowFeedbackAndHelpButtons?: boolean;
  sendAnalyticsEvent: (action: string, commentLevel?: number) => void;
}
