import * as React from 'react';
import { EditorPlugin } from '../../types';
import { WithProviders } from '../../../providerFactory/withProviders';
import {
  stateKey as blockTypeStateKey,
  BlockTypeState,
} from '../../../plugins/block-type';
import { stateKey as mediaStateKey } from '../../../plugins/media';
import { stateKey as hyperlinkStateKey } from '../../../plugins/hyperlink';
import { stateKey as mentionStateKey } from '../../../plugins/mentions';
import { stateKey as tablesStateKey } from '../../../plugins/table';
import { pluginKey as macroStateKey, MacroState } from '../macro/plugin';
import { stateKey as emojiStateKey } from '../../../plugins/emojis';
import { insertMacroFromMacroBrowser } from '../macro/actions';
import WithPluginState from '../../ui/WithPluginState';
import ToolbarInsertBlock from '../../../ui/ToolbarInsertBlock';

const insertBlockPlugin: EditorPlugin = {
  primaryToolbarComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    disabled,
    editorWidth,
  ) {
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
          }}
          // tslint:disable-next-line:jsx-no-lambda
          render={({
            blockTypeState = {} as BlockTypeState,
            mediaState,
            mentionsState,
            tablesState,
            macroState = {} as MacroState,
            hyperlinkState,
            emojiState,
          }) => (
            <ToolbarInsertBlock
              isDisabled={disabled}
              editorView={editorView}
              editorWidth={editorWidth}
              tableActive={tablesState && tablesState.tableActive}
              tableHidden={tablesState && tablesState.tableHidden}
              tableSupported={!!tablesState}
              mentionsEnabled={mentionsState && mentionsState.enabled}
              insertMentionQuery={
                mentionsState && mentionsState.insertMentionQuery
              }
              mentionsSupported={!!mentionsState}
              mediaUploadsEnabled={mediaState && mediaState.allowsUploads}
              onShowMediaPicker={mediaState && mediaState.showMediaPicker}
              mediaSupported={!!mediaState}
              availableWrapperBlockTypes={
                blockTypeState.availableWrapperBlockTypes
              }
              linkDisabled={!hyperlinkState.linkable || hyperlinkState.active}
              showLinkPanel={hyperlinkState.showLinkPanel}
              emojiDisabled={!emojiState.enabled}
              insertEmoji={emojiState.insertEmoji}
              emojiProvider={providers.emojiProvider}
              onInsertBlockType={blockTypeState.insertBlockType}
              onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
              macroProvider={macroState.macroProvider}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
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
};

export default insertBlockPlugin;
