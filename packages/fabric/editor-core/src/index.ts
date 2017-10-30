export {
  EmojiProvider,
  AtlassianEmojiMigrationResource as EmojiResource,
} from '@atlaskit/emoji';

export {
  DefaultMediaStateManager,
  MediaProvider,
  MediaState,
} from '@atlaskit/media-core';

export {
  AbstractMentionResource,
  MentionProvider,
  MentionResource,
  PresenceProvider,
  PresenceResource,
  MentionsResult,
} from '@atlaskit/mention';

export {
  TaskDecisionProvider,
  TaskDecisionResource
} from '@atlaskit/task-decision';

import ProviderFactory, { WithProviders } from './providerFactory';
export { version, name } from './version';
export * from './config';
export * from './plugins';
export * from './ui';
export * from './analytics';
export * from './nodeviews';
export * from './transformers';
export { ProviderFactory, WithProviders };
export {
  ErrorReporter,
  ErrorReportingHandler,
  JSONDocNode,
  JSONNode,
  toJSON,
  filterContentByType,
} from './utils';

export { default as Editor } from './editor';
export { default as EditorContext } from './editor/ui/EditorContext';
export { default as WithEditorActions } from './editor/ui/WithEditorActions';
export { default as WithHelpTrigger } from './editor/ui/WithHelpTrigger';
export { default as getPropsPreset } from './editor/create-editor/get-props-preset';
export { default as CollapsedEditor } from './editor/ui/CollapsedEditor';

export { createJIRASchema } from '@atlaskit/editor-common';
