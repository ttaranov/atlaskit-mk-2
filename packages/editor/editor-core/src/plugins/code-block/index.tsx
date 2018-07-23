import * as React from 'react';
import EditorCodeIcon from '@atlaskit/icon/glyph/editor/code';
import { codeBlock } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey, ActiveCodeBlock } from './pm-plugins/main';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import LanguagePicker from './ui/LanguagePicker';
import WithPluginState from '../../ui/WithPluginState';
import { setNodeAttributes, deleteNodeAtPos } from './commands';
import { focusStateKey } from '../base/pm-plugins/focus-handler';

export interface CodeBlockOptions {
  enableKeybindingsForIDE?: boolean;
}

const codeBlockPlugin = (options: CodeBlockOptions = {}) =>
  ({
    nodes() {
      return [{ name: 'codeBlock', node: codeBlock, rank: 800 }];
    },

    pmPlugins() {
      return [
        { rank: 700, plugin: ({ dispatch }) => plugin(dispatch) },
        {
          rank: 710,
          plugin: () => (options.enableKeybindingsForIDE ? ideUX : undefined),
        },
        { rank: 720, plugin: ({ schema }) => keymap(schema) },
      ];
    },

    contentComponent({
      editorView: view,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
    }) {
      if (appearance === 'message') {
        return null;
      }
      const domAtPos = pos => {
        const domRef = view.domAtPos(pos);
        return domRef.node.childNodes[domRef.offset];
      };
      return (
        <WithPluginState
          plugins={{
            activeCodeBlock: stateKey,
            isEditorFocused: focusStateKey,
          }}
          render={({
            activeCodeBlock,
            isEditorFocused,
          }: {
            activeCodeBlock: ActiveCodeBlock;
            isEditorFocused: boolean;
          }) => {
            if (activeCodeBlock) {
              const { pos, node } = activeCodeBlock;
              const codeBlockDOM = domAtPos(pos) as HTMLElement;
              const setLanguage = (language: string) => {
                setNodeAttributes(pos, { language })(view.state, view.dispatch);
                view.focus();
              };
              const deleteCodeBlock = () =>
                deleteNodeAtPos(pos)(view.state, view.dispatch);
              return (
                <LanguagePicker
                  activeCodeBlockDOM={codeBlockDOM}
                  setLanguage={setLanguage}
                  deleteCodeBlock={deleteCodeBlock}
                  activeLanguage={node.attrs.language}
                  isEditorFocused={isEditorFocused}
                  popupsMountPoint={popupsMountPoint}
                  popupsBoundariesElement={popupsBoundariesElement}
                />
              );
            }
            return null;
          }}
        />
      );
    },

    pluginsOptions: {
      quickInsert: [
        {
          title: 'Code block',
          keywords: ['javascript', 'typescript'],
          icon: () => <EditorCodeIcon label="Code block" />,
          action(insert, state) {
            const schema = state.schema;
            return insert(schema.nodes.codeBlock.createChecked());
          },
        },
      ],
    },
  } as EditorPlugin);

export default codeBlockPlugin;
