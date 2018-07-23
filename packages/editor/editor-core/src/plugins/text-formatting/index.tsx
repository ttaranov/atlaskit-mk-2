import * as React from 'react';
import {
  em,
  strong,
  strike,
  subsup,
  underline,
  code,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { ButtonGroup } from '../../ui/styles';
import {
  plugin as textFormattingPlugin,
  pluginKey as textFormattingPluginKey,
  TextFormattingState,
} from './pm-plugins/main';
import {
  plugin as clearFormattingPlugin,
  pluginKey as clearFormattingPluginKey,
  ClearFormattingState,
} from './pm-plugins/clear-formatting';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import keymapPlugin from './pm-plugins/keymap';
import ToolbarAdvancedTextFormatting from './ui/ToolbarAdvancedTextFormatting';
import ToolbarTextFormatting from './ui/ToolbarTextFormatting';
import WithPluginState from '../../ui/WithPluginState';

export interface TextFormattingOptions {
  disableSuperscriptAndSubscript?: boolean;
  disableUnderline?: boolean;
  disableCode?: boolean;
  disableSmartTextCompletion?: boolean;
}

const textFormatting = (options: TextFormattingOptions): EditorPlugin => ({
  marks() {
    return [
      { name: 'em', mark: em, rank: 200 },
      { name: 'strong', mark: strong, rank: 300 },
      { name: 'strike', mark: strike, rank: 400 },
    ]
      .concat(
        options.disableCode ? [] : { name: 'code', mark: code, rank: 700 },
      )
      .concat(
        options.disableSuperscriptAndSubscript
          ? []
          : { name: 'subsup', mark: subsup, rank: 500 },
      )
      .concat(
        options.disableUnderline
          ? []
          : { name: 'underline', mark: underline, rank: 600 },
      );
  },

  pmPlugins() {
    return [
      { rank: 800, plugin: ({ dispatch }) => textFormattingPlugin(dispatch) },
      { rank: 805, plugin: () => textFormattingCursorPlugin },
      {
        rank: 810,
        plugin: ({ schema }) => textFormattingInputRulePlugin(schema),
      },
      {
        rank: 811,
        plugin: ({ schema }) =>
          !options.disableSmartTextCompletion
            ? textFormattingSmartInputRulePlugin
            : undefined,
      },
      { rank: 820, plugin: ({ dispatch }) => clearFormattingPlugin(dispatch) },
      {
        rank: 830,
        plugin: ({ schema }) => clearFormattingKeymapPlugin(schema),
      },
      { rank: 835, plugin: ({ schema }) => keymapPlugin(schema) },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsScrollableElement,
    isToolbarReducedSpacing,
    disabled,
  }) {
    return (
      <WithPluginState
        plugins={{
          textFormattingState: textFormattingPluginKey,
          clearFormattingState: clearFormattingPluginKey,
        }}
        render={({
          textFormattingState,
          clearFormattingState,
        }: {
          textFormattingState: TextFormattingState;
          clearFormattingState: ClearFormattingState;
        }): any => {
          return (
            <ButtonGroup width={isToolbarReducedSpacing ? 'small' : 'large'}>
              <ToolbarTextFormatting
                disabled={disabled}
                editorView={editorView}
                textFormattingState={textFormattingState}
                isReducedSpacing={isToolbarReducedSpacing}
              />
              <ToolbarAdvancedTextFormatting
                editorView={editorView}
                isDisabled={disabled}
                isReducedSpacing={isToolbarReducedSpacing}
                textFormattingState={textFormattingState}
                clearFormattingState={clearFormattingState}
                popupsMountPoint={popupsMountPoint}
                popupsScrollableElement={popupsScrollableElement}
              />
            </ButtonGroup>
          );
        }}
      />
    );
  },
});

export default textFormatting;
