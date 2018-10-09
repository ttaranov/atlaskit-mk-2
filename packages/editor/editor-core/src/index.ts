// Used in products integration code
export { name, version } from './version';
export { default as Editor } from './editor';
export { default as getPropsPreset } from './create-editor/get-props-preset';
export { default as EditorContext } from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';
export { EmojiResource } from '@atlaskit/emoji';
export {
  DefaultMediaStateManager,
  MediaStateManager,
  MediaProvider,
  CustomMediaPicker,
} from './plugins/media';
export { CollabEditProvider } from './plugins/collab-edit';
export { MediaOptions } from './plugins/media';
export {
  AbstractMentionResource,
  MentionProvider,
  MentionResource,
  PresenceProvider,
  PresenceResource,
} from '@atlaskit/mention';
export {
  QuickInsertProvider,
  QuickInsertItem,
} from './plugins/quick-insert/types';

// Used in mobile bridge
export { stateKey as mediaPluginKey } from './plugins/media/pm-plugins/main';
export { mentionPluginKey, MentionPluginState } from './plugins/mentions';
export {
  TextFormattingState,
  pluginKey as textFormattingStateKey,
} from './plugins/text-formatting/pm-plugins/main';
export { blockPluginStateKey, BlockTypeState } from './plugins';
export {
  ListsPluginState as ListsState,
  pluginKey as listsStateKey,
} from './plugins/lists/pm-plugins/main';
export {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from './plugins/lists/commands';
export {
  toggleSuperscript,
  toggleSubscript,
  toggleStrike,
  toggleCode,
  toggleUnderline,
  toggleEm,
  toggleStrong,
} from './plugins/text-formatting/commands/text-formatting';
export { EventDispatcher } from './event-dispatcher';

// Used in editor-test-helpers
export { setTextSelection } from './utils';
export { ReactEditorView } from './create-editor';
export { getDefaultPluginsList } from './create-editor/create-plugins-list';
export { EditorPlugin, EditorProps, EditorInstance } from './types';
export { default as EditorActions } from './actions';
export { MacroProvider, MacroAttributes, ExtensionType } from './plugins/macro';
export { CardProvider } from './plugins/card';
export {
  PortalProvider,
  PortalProviderAPI,
  PortalRenderer,
} from './ui/PortalProvider';
