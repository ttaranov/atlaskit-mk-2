import * as React from 'react';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../actions';

import {
  Transformer,
  ContextIdentifierProvider,
  ExtensionHandlers,
} from '@atlaskit/editor-common';
import { ActivityProvider } from '@atlaskit/activity';
import { DelegateAnalyticsEvent } from '@atlaskit/analytics';
import { MentionProvider } from '@atlaskit/mention';
import { EmojiProvider } from '@atlaskit/emoji';
import { TaskDecisionProvider } from '@atlaskit/task-decision';

import { PluginConfig as TablesPluginConfig } from '../plugins/table/types';
import { TextColorPluginConfig } from '../plugins/text-color/pm-plugins/main';
import { MediaProvider, MediaState } from '../plugins/media/pm-plugins/main';
import { ErrorReportingHandler } from '../utils/error-reporter';
import { AnalyticsHandler } from '../analytics';

import { ImageUploadHandler } from '../plugins/image-upload';
import { TextFormattingOptions } from '../plugins/text-formatting';
import { CollabEditProvider } from '../plugins/collab-edit';
import { MacroProvider } from '../plugins/macro/types';
import { MediaOptions } from '../plugins/media';
import { PlaceholderTextOptions } from '../plugins/placeholder-text';
import { CollabEditOptions } from '../plugins/collab-edit';
import { CodeBlockOptions } from '../plugins/code-block';
import { CardProvider, CardOptions } from '../plugins/card';
import { QuickInsertOptions } from '../plugins/quick-insert/types';

export type EditorAppearance =
  | 'message'
  | 'inline-comment'
  | 'comment'
  | 'full-page'
  | 'chromeless'
  | 'mobile'
  | undefined;

export type ReactElement = React.ReactElement<any> | React.ReactElement<any>[];

export type InsertMenuCustomItem = {
  content: string;
  value: { name: string | null };
  tooltipDescription?: string;
  tooltipPosition?: string;
  elemBefore?: ReactElement | string;
  elemAfter?: ReactElement | string;
  isDisabled?: boolean;
  className?: string;
  onClick?: (editorActions: EditorActions) => void;
};

export interface ExtensionConfig {
  stickToolbarToBottom?: boolean;
  allowBreakout?: boolean;
}

export interface EditorProps {
  appearance?: EditorAppearance;
  // Legacy analytics support
  analyticsHandler?: AnalyticsHandler;
  // For @atlaskit/analytics support
  delegateAnalyticsEvent?: DelegateAnalyticsEvent;

  contentComponents?: ReactElement;
  primaryToolbarComponents?: ReactElement;
  secondaryToolbarComponents?: ReactElement;
  addonToolbarComponents?: ReactElement;

  allowBlockType?: { exclude?: Array<string> };
  allowTasksAndDecisions?: boolean;
  allowRule?: boolean;
  allowCodeBlocks?: boolean | CodeBlockOptions;
  allowLists?: boolean;
  allowTextColor?: boolean | TextColorPluginConfig;
  allowTables?: boolean | TablesPluginConfig;
  allowHelpDialog?: boolean;
  allowJiraIssue?: boolean;
  allowUnsupportedContent?: boolean;
  allowPanel?: boolean;
  allowExtension?: boolean | ExtensionConfig;
  allowConfluenceInlineComment?: boolean;
  allowPlaceholderCursor?: boolean;
  allowTemplatePlaceholders?: boolean | PlaceholderTextOptions;
  allowDate?: boolean;
  allowGapCursor?: boolean;
  allowInlineAction?: boolean;

  // Temporary flag to enable layouts while it's under development
  allowLayouts?: boolean;

  quickInsert?: QuickInsertOptions;

  UNSAFE_cards?: CardOptions;

  saveOnEnter?: boolean;
  shouldFocus?: boolean;
  disabled?: boolean;

  errorReporterHandler?: ErrorReportingHandler;
  uploadErrorHandler?: (state: MediaState) => void;

  activityProvider?: Promise<ActivityProvider>;
  collabEditProvider?: Promise<CollabEditProvider>;
  presenceProvider?: Promise<any>;
  emojiProvider?: Promise<EmojiProvider>;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;

  legacyImageUploadProvider?: Promise<ImageUploadHandler>;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
  macroProvider?: Promise<MacroProvider>;
  cardProvider?: Promise<CardProvider>;

  waitForMediaUpload?: boolean;
  contentTransformerProvider?: (schema: Schema) => Transformer<string>;

  media?: MediaOptions;
  collabEdit?: CollabEditOptions;
  textFormatting?: TextFormattingOptions;

  maxHeight?: number;
  maxContentSize?: number;
  placeholder?: string;
  defaultValue?: Node | string | Object;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  insertMenuItems?: InsertMenuCustomItem[];
  editorActions?: EditorActions;

  onChange?: (editorView: EditorView) => void;
  onSave?: (editorView: EditorView) => void;
  onCancel?: (editorView: EditorView) => void;

  extensionHandlers?: ExtensionHandlers;
}
