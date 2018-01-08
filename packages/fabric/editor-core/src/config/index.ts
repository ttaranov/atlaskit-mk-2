import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { MentionResource } from '@atlaskit/mention';
import { EmojiResource } from '@atlaskit/emoji';
import { MediaProvider } from '@atlaskit/media-core';
import { TaskDecisionResource } from '@atlaskit/task-decision';

export interface EditorServicesConfig {
  contextIdentifierResource?: () => Promise<ContextIdentifierProvider>;
  emojiResourceProvider?: () => Promise<EmojiResource>;
  mediaResourceProvider?: () => Promise<MediaProvider>;
  mentionResourceProvider?: () => Promise<MentionResource>;
  taskDecisionResourceProvider?: () => Promise<TaskDecisionResource>;
}
