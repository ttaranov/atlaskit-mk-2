import * as React from 'react';
import { EditorPlugin } from '../../types';
import { WithProviders } from '@atlaskit/editor-common';
import {
  stateKey as blockTypeStateKey,
  BlockTypeState,
} from '../../../plugins/block-type';
import { stateKey as mediaStateKey } from '../../../plugins/media';
import { stateKey as hyperlinkStateKey } from '../../../plugins/hyperlink';
import { stateKey as mentionStateKey } from '../../../plugins/mentions';
import { stateKey as tablesStateKey } from '../../../plugins/table';
import { stateKey as imageUploadStateKey } from '../../../plugins/image-upload';
import { pluginKey as placeholderTextStateKey } from '../../../editor/plugins/placeholder-text';
import {
  pluginKey as macroStateKey,
  MacroState,
  insertMacroFromMacroBrowser,
} from '../macro';
import { pluginKey as dateStateKey } from '../date/plugin';
import { stateKey as emojiStateKey } from '../../../plugins/emojis';
import WithPluginState from '../../ui/WithPluginState';
import ToolbarInsertBlock from '../../../ui/ToolbarInsertBlock';
import { ToolbarSize } from '../../ui/Toolbar';

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
}

const insertBlockPlugin = (options: InsertBlockOptions): EditorPlugin => ({
  primaryToolbarComponent({
    editorView,
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
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{
            blockTypeState: blockTypeStateKey,
            mediaState: mediaStateKey,
            tablesState: tablesStateKey,
            mentionsState: mentionStateKey,
            macroState: macroStateKey,
            hyperlinkState: hyperlinkStateKey,
            emojiState: emojiStateKey,
            dateState: dateStateKey,
            imageUpload: imageUploadStateKey,
            placeholderTextState: placeholderTextStateKey,
          }}
          render={({
            blockTypeState = {} as BlockTypeState,
            mediaState,
            mentionsState,
            tablesState,
            macroState = {} as MacroState,
            hyperlinkState,
            emojiState,
            dateState,
            imageUpload,
            placeholderTextState,
          }) => (
            <ToolbarInsertBlock
              buttons={buttons}
              isReducedSpacing={isToolbarReducedSpacing}
              isDisabled={disabled}
              editorView={editorView}
              tableActive={tablesState && tablesState.tableActive}
              tableHidden={tablesState && tablesState.tableHidden}
              tableSupported={!!tablesState}
              mentionsEnabled={mentionsState && mentionsState.enabled}
              dateEnabled={!!dateState}
              placeholderTextEnabled={
                placeholderTextState && placeholderTextState.allowInserting
              }
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
                !hyperlinkState.linkable ||
                hyperlinkState.active
              }
              showLinkPanel={hyperlinkState && hyperlinkState.showLinkPanel}
              emojiDisabled={!emojiState || !emojiState.enabled}
              insertEmoji={emojiState && emojiState.insertEmoji}
              emojiProvider={providers.emojiProvider}
              onInsertBlockType={blockTypeState.insertBlockType}
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
