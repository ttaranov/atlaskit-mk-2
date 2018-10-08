import * as React from 'react';
import { EditorPlugin } from '../../types';
import { WithProviders } from '@atlaskit/editor-common';
import { pluginKey as blockTypeStateKey } from '../block-type/pm-plugins/main';
import { stateKey as mediaStateKey } from '../media/pm-plugins/main';
import { stateKey as hyperlinkPluginKey } from '../hyperlink/pm-plugins/main';
import { mentionPluginKey as mentionStateKey } from '../mentions/pm-plugins/main';
import { pluginKey as tablesStateKey } from '../table/pm-plugins/main';
import { stateKey as imageUploadStateKey } from '../image-upload/pm-plugins/main';
import { pluginKey as placeholderTextStateKey } from '../placeholder-text';
import { pluginKey as layoutStateKey } from '../layout';
import {
  pluginKey as macroStateKey,
  MacroState,
  insertMacroFromMacroBrowser,
} from '../macro';
import { pluginKey as dateStateKey } from '../date/plugin';
import { pluginKey as emojiPluginKey } from '../emoji/pm-plugins/main';
import { insertEmoji } from '../emoji/pm-plugins/actions';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar';
import ToolbarInsertBlock from './ui/ToolbarInsertBlock';
import { insertBlockType } from '../block-type/commands';

const toolbarSizeToButtons = toolbarSize => {
  switch (toolbarSize) {
    case ToolbarSize.XXL:
    case ToolbarSize.XL:
    case ToolbarSize.L:
    case ToolbarSize.M:
      return 5;

    case ToolbarSize.S:
      return 2;

    default:
      return 0;
  }
};

export interface InsertBlockOptions {
  insertMenuItems?: any;
  horizontalRuleEnabled?: boolean;
}

const insertBlockPlugin = (options: InsertBlockOptions): EditorPlugin => ({
  primaryToolbarComponent({
    editorView,
    appearance,
    editorActions,
    eventDispatcher,
    providerFactory,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const buttons = toolbarSizeToButtons(toolbarSize);
    const renderNode = providers => {
      return (
        <WithPluginState
          plugins={{
            blockTypeState: blockTypeStateKey,
            mediaState: mediaStateKey,
            tablesState: tablesStateKey,
            mentionsState: mentionStateKey,
            macroState: macroStateKey,
            hyperlinkState: hyperlinkPluginKey,
            emojiState: emojiPluginKey,
            dateState: dateStateKey,
            imageUpload: imageUploadStateKey,
            placeholderTextState: placeholderTextStateKey,
            layoutState: layoutStateKey,
          }}
          render={({
            blockTypeState,
            mediaState,
            mentionsState,
            tablesState,
            macroState = {} as MacroState,
            hyperlinkState,
            emojiState,
            dateState,
            imageUpload,
            placeholderTextState,
            layoutState,
          }) => (
            <ToolbarInsertBlock
              buttons={buttons}
              isReducedSpacing={isToolbarReducedSpacing}
              isDisabled={disabled}
              editorView={editorView}
              tableSupported={!!tablesState}
              mentionsEnabled={mentionsState && mentionsState.enabled}
              decisionSupported={!!editorView.state.schema.nodes.decisionItem}
              dateEnabled={!!dateState}
              placeholderTextEnabled={
                placeholderTextState && placeholderTextState.allowInserting
              }
              layoutSectionEnabled={!!layoutState}
              insertMentionQuery={
                mentionsState && mentionsState.insertMentionQuery
              }
              mentionsSupported={!!mentionsState}
              mediaUploadsEnabled={mediaState && mediaState.allowsUploads}
              onShowMediaPicker={mediaState && mediaState.showMediaPicker}
              mediaSupported={!!mediaState}
              imageUploadSupported={!!imageUpload}
              imageUploadEnabled={imageUpload && imageUpload.enabled}
              handleImageUpload={
                imageUpload && imageUpload.handleImageUpload.bind(imageUpload)
              }
              availableWrapperBlockTypes={
                blockTypeState.availableWrapperBlockTypes
              }
              linkSupported={!!hyperlinkState}
              linkDisabled={
                !hyperlinkState ||
                !hyperlinkState.canInsertLink ||
                hyperlinkState.activeLinkMark
              }
              emojiDisabled={!emojiState}
              insertEmoji={insertEmoji}
              emojiProvider={providers.emojiProvider}
              horizontalRuleEnabled={options.horizontalRuleEnabled}
              onInsertBlockType={insertBlockType}
              onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
              macroProvider={macroState.macroProvider}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              insertMenuItems={options.insertMenuItems}
              editorActions={editorActions}
            />
          )}
        />
      );
    };

    return (
      <WithProviders
        providerFactory={providerFactory}
        providers={['emojiProvider']}
        renderNode={renderNode}
      />
    );
  },
});

export default insertBlockPlugin;
