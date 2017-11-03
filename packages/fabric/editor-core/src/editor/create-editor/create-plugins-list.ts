import { EditorPlugin, EditorProps } from '../types';
import {
  basePlugin,
  placeholderPlugin,
  blockTypePlugin,
  textFormattingPlugin,
  mentionsPlugin,
  emojiPlugin,
  tasksAndDecisionsPlugin,
  saveOnEnterPlugin,
  mediaPlugin,
  imageUploadPlugin,
  maxContentSizePlugin,
  hyperlinkPlugin,
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
  confluenceInlineComment
} from '../plugins';

/**
 * Returns list of plugins that are absolutely necessary for editor to work
 */
export function getDefaultPluginsList(): EditorPlugin[] {
  return [pastePlugin, basePlugin, blockTypePlugin, placeholderPlugin];
}

/**
 * Maps EditorProps to EditorPlugins
 */
export default function createPluginsList(props: EditorProps): EditorPlugin[] {
  const plugins = getDefaultPluginsList();

  if (props.allowTextFormatting) {
    plugins.push(textFormattingPlugin);
  }

  if (props.allowTextColor) {
    plugins.push(textColorPlugin);
  }

  if (props.allowHyperlinks) {
    plugins.push(hyperlinkPlugin);
  }

  if (props.allowLists) {
    plugins.push(listsPlugin);
  }

  if (props.allowCodeBlocks) {
    plugins.push(codeBlockPlugin);
  }

  if (props.allowTables) {
    plugins.push(tablesPlugin);
  }

  if (props.mentionProvider) {
    plugins.push(mentionsPlugin);
  }

  if (props.emojiProvider) {
    plugins.push(emojiPlugin);
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

  if (props.mediaProvider) {
    plugins.push(mediaPlugin);
  }

  if (props.legacyImageUploadProvider) {
    plugins.push(imageUploadPlugin);
  }

  if (props.collabEditProvider) {
    plugins.push(collabEditPlugin);
  }

  if(props.maxContentSize) {
    plugins.push(maxContentSizePlugin);
  }

  if(props.allowJiraIssue) {
    plugins.push(jiraIssuePlugin);
  }

  if(props.allowUnsupportedContent) {
    plugins.push(unsupportedContentPlugin);
  }

  if(props.allowPanel) {
    plugins.push(panelPlugin);
  }

  if(props.allowInlineMacro) {
    plugins.push(macroPlugin);
  }

  if(props.allowConfluenceInlineComment) {
    plugins.push(confluenceInlineComment);
  }

  // UI only plugins
  plugins.push(insertBlockPlugin);

  return plugins;
}
