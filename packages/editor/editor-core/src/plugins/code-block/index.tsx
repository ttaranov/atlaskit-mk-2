import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Objects24CodeIcon from '@atlaskit/icon/glyph/objects/24/code';
import { codeBlock } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { plugin, stateKey, CodeBlockState } from './pm-plugins/main';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import LanguagePicker from './ui/LanguagePicker';
import WithPluginState from '../../ui/WithPluginState';
import { setNodeAttributes, deleteNodeAtPos } from './commands';

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
        { rank: 700, plugin: () => plugin },
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
          plugins={{ codeBlockState: stateKey }}
          render={({ codeBlockState }: { codeBlockState: CodeBlockState }) => {
            if (codeBlockState.activeCodeBlock) {
              const { pos, node } = codeBlockState.activeCodeBlock;
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
                  isEditorFocused={codeBlockState.isEditorFocused}
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
          icon: () => (
            <Objects24CodeIcon label="Code block" primaryColor={colors.N300} />
          ),
          action(insert, state) {
            const schema = state.schema;
            return insert(schema.nodes.codeBlock.createChecked());
          },
        },
      ],
    },
  } as EditorPlugin);

export default codeBlockPlugin;
