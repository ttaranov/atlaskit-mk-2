import * as React from 'react';
import { EditorPlugin } from '../../types';
import { stateKey as blockTypeStateKey, BlockTypeState } from '../../../plugins/block-type';
import { stateKey as mediaStateKey, MediaPluginState } from '../../../plugins/media';
import { stateKey as tablesStateKey, TableState } from '../../../plugins/table';
import { pluginKey as macroStateKey, MacroState } from '../macro/plugin';
import { insertMacroFromMacroBrowser } from '../macro/actions';
import WithPluginState from '../../ui/WithPluginState';
import ToolbarInsertBlock from '../../../ui/ToolbarInsertBlock';

const insertBlockPlugin: EditorPlugin = {
  primaryToolbarComponent(editorView, eventDispatcher, providerFactory, appearance, popupsMountPoint, popupsBoundariesElement, disabled) {
    const isCommentAppearance = appearance === 'comment';

    return <WithPluginState
      editorView={editorView}
      eventDispatcher={eventDispatcher}
      plugins={{
        blockTypeState: blockTypeStateKey,
        mediaState: !isCommentAppearance ? mediaStateKey : undefined,
        tablesState: tablesStateKey,
        macroState: macroStateKey
      }}
      // tslint:disable-next-line:jsx-no-lambda
      render={({
        blockTypeState = {} as BlockTypeState,
        mediaState = {} as MediaPluginState,
        tablesState = {} as TableState,
        macroState = {} as MacroState
      }) => (
        <ToolbarInsertBlock
          isDisabled={disabled}
          editorView={editorView}
          tableActive={tablesState.tableActive}
          tableHidden={tablesState.tableHidden}

          mediaUploadsEnabled={mediaState.allowsUploads}
          onShowMediaPicker={mediaState.showMediaPicker}

          availableWrapperBlockTypes={blockTypeState.availableWrapperBlockTypes}
          onInsertBlockType={blockTypeState.insertBlockType}

          onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
          macroProvider={macroState.macroProvider}

          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
        />
      )}
    />;
  }
};

export default insertBlockPlugin;
