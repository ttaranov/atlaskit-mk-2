import { EditorPlugin, EditorProps } from '../types';
import {
  basePlugin,
  blockTypePlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  codeBlockPlugin,
  collabEditPlugin,
  confluenceInlineComment,
  datePlugin,
  emojiPlugin,
  extensionPlugin,
  fakeTextCursorPlugin,
  helpDialogPlugin,
  hyperlinkPlugin,
  imageUploadPlugin,
  insertBlockPlugin,
  isMultilineContentPlugin,
  jiraIssuePlugin,
  layoutPlugin,
  listsPlugin,
  macroPlugin,
  maxContentSizePlugin,
  mediaPlugin,
  mentionsPlugin,
  panelPlugin,
  pastePlugin,
  placeholderPlugin,
  placeholderTextPlugin,
  rulePlugin,
  saveOnEnterPlugin,
  submitEditorPlugin,
  tablesPlugin,
  tasksAndDecisionsPlugin,
  textColorPlugin,
  textFormattingPlugin,
  unsupportedContentPlugin,
  widthPlugin,
  typeAheadPlugin,
  quickInsertPlugin,
  gapCursorPlugin,
  inlineActionPlugin,
  cardPlugin,
  floatingToolbarPlugin,
  statusPlugin,
  gridPlugin,
} from '../plugins';

/**
 * Returns list of plugins that are absolutely necessary for editor to work
 */
export function getDefaultPluginsList(props: EditorProps = {}): EditorPlugin[] {
  return [
    pastePlugin,
    basePlugin,
    blockTypePlugin,
    placeholderPlugin,
    clearMarksOnChangeToEmptyDocumentPlugin,
    hyperlinkPlugin,
    textFormattingPlugin(props.textFormatting || {}),
    widthPlugin,
    typeAheadPlugin,
    unsupportedContentPlugin,
  ];
}

/**
 * Maps EditorProps to EditorPlugins
 */
export default function createPluginsList(props: EditorProps): EditorPlugin[] {
  const plugins = getDefaultPluginsList(props);

  if (props.quickInsert) {
    plugins.push(quickInsertPlugin);
  }

  if (props.allowInlineAction) {
    plugins.push(inlineActionPlugin);
  }

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
    const options = props.allowCodeBlocks !== true ? props.allowCodeBlocks : {};
    plugins.push(codeBlockPlugin(options));
  }

  if (props.mentionProvider) {
    plugins.push(mentionsPlugin);
  }

  if (props.emojiProvider) {
    plugins.push(emojiPlugin);
  }

  if (props.allowTables) {
    plugins.push(tablesPlugin(props.allowTables));
  }

  if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
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

    if (!props.media && !props.mediaProvider) {
      plugins.push(
        mediaPlugin({
          allowMediaSingle: { disableLayout: true },
          allowMediaGroup: false,
        }),
      );
    }
  }

  if (props.collabEdit || props.collabEditProvider) {
    plugins.push(collabEditPlugin(props.collabEdit));
  }

  if (props.maxContentSize) {
    plugins.push(maxContentSizePlugin);
  }

  if (props.allowJiraIssue) {
    plugins.push(jiraIssuePlugin);
  }

  if (props.allowPanel) {
    plugins.push(panelPlugin);
  }

  if (props.allowExtension) {
    plugins.push(extensionPlugin);
  }

  if (props.macroProvider) {
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
      props.allowTemplatePlaceholders !== true
        ? props.allowTemplatePlaceholders
        : {};
    plugins.push(placeholderTextPlugin(options));
  }

  if (props.allowLayouts) {
    plugins.push(layoutPlugin);
  }

  if (props.allowGapCursor) {
    plugins.push(gapCursorPlugin);
  }

  if (props.UNSAFE_cards) {
    plugins.push(cardPlugin);
  }

  if (props.allowStatus) {
    plugins.push(statusPlugin);
  }

  // UI only plugins
  plugins.push(
    insertBlockPlugin({
      insertMenuItems: props.insertMenuItems,
      horizontalRuleEnabled: props.allowRule,
    }),
  );

  plugins.push(gridPlugin);
  plugins.push(submitEditorPlugin);
  plugins.push(fakeTextCursorPlugin);
  plugins.push(floatingToolbarPlugin);

  if (props.appearance === 'message') {
    plugins.push(isMultilineContentPlugin);
  }

  return plugins;
}
