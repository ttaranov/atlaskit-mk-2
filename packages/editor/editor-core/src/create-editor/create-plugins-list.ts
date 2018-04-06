import { EditorPlugin, EditorProps } from '../types';
import {
  basePlugin,
  placeholderPlugin,
  blockTypePlugin,
  mentionsPlugin,
  emojiPlugin,
  tasksAndDecisionsPlugin,
  saveOnEnterPlugin,
  submitEditorPlugin,
  mediaPlugin,
  imageUploadPlugin,
  maxContentSizePlugin,
  isMultilineContentPlugin,
  codeBlockPlugin,
  pastePlugin,
  listsPlugin,
  textColorPlugin,
  insertBlockPlugin,
  tablesPlugin,
  collabEditPlugin,
  helpDialogPlugin,
  jiraIssuePlugin,
  unsupportedContentPlugin,
  panelPlugin,
  macroPlugin,
  confluenceInlineComment,
  fakeTextCursorPlugin,
  extensionPlugin,
  rulePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  datePlugin,
  placeholderTextPlugin,
  hyperlinkPlugin,
  textFormattingPlugin,
  widthPlugin,
} from '../plugins';

/**
 * Returns list of plugins that are absolutely necessary for editor to work
 */
export function getDefaultPluginsList(): EditorPlugin[] {
  return [
    pastePlugin,
    basePlugin,
    blockTypePlugin,
    placeholderPlugin,
    clearMarksOnChangeToEmptyDocumentPlugin,
    hyperlinkPlugin,
    textFormattingPlugin,
    widthPlugin,
  ];
}

/**
 * Maps EditorProps to EditorPlugins
 */
export default function createPluginsList(props: EditorProps): EditorPlugin[] {
  const plugins = getDefaultPluginsList();

  if (props.allowTextColor) {
    plugins.push(textColorPlugin);
  }

  if (props.allowLists) {
    plugins.push(listsPlugin);
  }

  if (props.allowRule) {
    plugins.push(rulePlugin);
  }

  if (props.media || props.mediaProvider) {
    plugins.push(mediaPlugin(props.media));
  }

  if (props.allowCodeBlocks) {
    plugins.push(codeBlockPlugin);
  }

  if (props.mentionProvider) {
    plugins.push(mentionsPlugin);
  }

  if (props.emojiProvider) {
    plugins.push(emojiPlugin);
  }

  if (props.allowTables) {
    plugins.push(tablesPlugin);
  }

  if (props.allowTasksAndDecisions) {
    plugins.push(tasksAndDecisionsPlugin);
  }

  if (props.allowHelpDialog) {
    plugins.push(helpDialogPlugin);
  }

  if (props.saveOnEnter) {
    plugins.push(saveOnEnterPlugin);
  }

  if (props.legacyImageUploadProvider) {
    plugins.push(imageUploadPlugin);
  }

  if (props.collabEditProvider) {
    plugins.push(collabEditPlugin);
  }

  if (props.maxContentSize) {
    plugins.push(maxContentSizePlugin);
  }

  if (props.allowJiraIssue) {
    plugins.push(jiraIssuePlugin);
  }

  if (props.allowUnsupportedContent) {
    plugins.push(unsupportedContentPlugin);
  }

  if (props.allowPanel) {
    plugins.push(panelPlugin);
  }

  if (props.allowExtension) {
    plugins.push(extensionPlugin);
  }

  if (props.extensionProvider) {
    plugins.push(macroPlugin);
  }

  if (props.allowConfluenceInlineComment) {
    plugins.push(confluenceInlineComment);
  }

  if (props.allowDate) {
    plugins.push(datePlugin);
  }

  if (props.allowTemplatePlaceholders) {
    const options =
      props.allowTemplatePlaceholders === true
        ? {}
        : props.allowTemplatePlaceholders;
    plugins.push(placeholderTextPlugin(options));
  }

  // UI only plugins
  plugins.push(
    insertBlockPlugin({
      insertMenuItems: props.insertMenuItems,
      horizontalRuleEnabled: props.allowRule,
    }),
  );

  plugins.push(submitEditorPlugin);
  plugins.push(fakeTextCursorPlugin);

  if (props.appearance === 'message') {
    plugins.push(isMultilineContentPlugin);
  }

  return plugins;
}
