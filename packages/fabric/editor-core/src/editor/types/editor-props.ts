import * as React from 'react';
import { Node, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaProvider, MediaState } from '@atlaskit/media-core';
import { Transformer } from '@atlaskit/editor-common';
import { ActivityProvider } from '@atlaskit/activity';
import { DelegateAnalyticsEvent } from '@atlaskit/analytics';
import { MentionProvider } from '@atlaskit/mention';

import { ErrorReportingHandler } from '../../utils/error-reporter';
import { AnalyticsHandler } from '../../analytics';
import { ImageUploadHandler } from '../plugins/image-upload';
import { TextFormattingOptions } from '../plugins/text-formatting';
import { CollabEditProvider } from '../plugins/collab-edit';
import { MacroProvider } from '../plugins/macro/types';
import { MediaOptions } from '../plugins/media';

export type EditorAppearance =
  | 'message'
  | 'inline-comment'
  | 'comment'
  | 'full-page'
  | 'chromeless'
  | undefined;

export type ReactElement = React.ReactElement<any> | React.ReactElement<any>[];

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

  allowTextFormatting?: boolean | TextFormattingOptions;
  allowMentions?: boolean;
  allowTasksAndDecisions?: boolean;
  allowHyperlinks?: boolean;
  allowRule?: boolean;
  allowCodeBlocks?: boolean;
  allowLists?: boolean;
  allowTextColor?: boolean;
  allowTables?: boolean;
  allowHelpDialog?: boolean;
  allowJiraIssue?: boolean;
  allowUnsupportedContent?: boolean;
  allowPanel?: boolean;
  allowExtension?: boolean;
  allowConfluenceInlineComment?: boolean;
  allowPlaceholderCursor?: boolean;

  saveOnEnter?: boolean;
  shouldFocus?: boolean;
  disabled?: boolean;

  errorReporterHandler?: ErrorReportingHandler;
  uploadErrorHandler?: (state: MediaState) => void;

  activityProvider?: Promise<ActivityProvider>;
  collabEditProvider?: Promise<CollabEditProvider>;
  presenceProvider?: Promise<any>;
  emojiProvider?: Promise<any>;
  legacyImageUploadProvider?: Promise<ImageUploadHandler>;
  mentionProvider?: Promise<MentionProvider>;
  mediaProvider?: Promise<MediaProvider>;
  macroProvider?: Promise<MacroProvider>;
  waitForMediaUpload?: boolean;
  contentTransformerProvider?: (schema: Schema) => Transformer<string>;
  media?: MediaOptions;

  maxHeight?: number;
  maxContentSize?: number;
  placeholder?: string;
  defaultValue?: Node | string | Object;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;

  onChange?: (editorView: EditorView) => void;
  onSave?: (editorView: EditorView) => void;
  onCancel?: (editorView: EditorView) => void;
}
