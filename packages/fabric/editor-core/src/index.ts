// Usefull Exports

export { name, version } from './version';

export { default as Editor, EditorWithAnalytics } from './editor';
export { default as EditorContext } from './editor/ui/EditorContext';
export { default as WithEditorActions } from './editor/ui/WithEditorActions';
export { default as WithHelpTrigger } from './editor/ui/WithHelpTrigger';
export {
  default as getPropsPreset,
} from './editor/create-editor/get-props-preset';
export { default as CollapsedEditor } from './editor/ui/CollapsedEditor';
export { default as ToolbarHelp } from './editor/ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';

export {
  ErrorReporter,
  ErrorReportingHandler,
  JSONDocNode,
  JSONNode,
  toJSON,
  filterContentByType,
  setTextSelection,
} from './utils';

// Used in editor-test-helpers

export { keyCodes } from './keymaps';
export { reactNodeViewPlugins } from './plugins';
export { createEditor } from './editor/create-editor';
export {
  getDefaultPluginsList,
} from './editor/create-editor/create-plugins-list';
export { EditorPlugin, EditorProps, EditorInstance } from './editor/types';
export { default as EditorActions } from './editor/actions';

// Useles exports

export {
  createJIRASchema,
  ProviderFactory,
  WithProviders,
} from '@atlaskit/editor-common';
export {
  MacroProvider,
  MacroAttributes,
  ExtensionType,
} from './editor/plugins/macro';

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

export * from './config';
export * from './analytics'; // ?
