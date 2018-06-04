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
  stateKey as textFormattingStateKey,
} from './pm-plugins/main';
import {
  plugin as clearFormattingPlugin,
  stateKey as clearFormattingStateKey,
} from './pm-plugins/clear-formatting';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import ToolbarTextFormatting from './ui/ToolbarTextFormatting';
import ToolbarAdvancedTextFormatting from './ui/ToolbarAdvancedTextFormatting';

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
      { rank: 800, plugin: () => textFormattingPlugin },
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
      { rank: 820, plugin: () => clearFormattingPlugin },
      {
        rank: 830,
        plugin: ({ schema }) => clearFormattingKeymapPlugin(schema),
      },
    ];
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsScrollableElement,
    isToolbarReducedSpacing,
    disabled,
  }) {
    const textFormattingPluginState = textFormattingStateKey.getState(
      editorView.state,
    );
    const clearFormattingPluginState = clearFormattingStateKey.getState(
      editorView.state,
    );

    return (
      <ButtonGroup width={isToolbarReducedSpacing ? 'small' : 'large'}>
        <ToolbarTextFormatting
          disabled={disabled}
          editorView={editorView}
          pluginState={textFormattingPluginState}
          isReducedSpacing={isToolbarReducedSpacing}
        />
        <ToolbarAdvancedTextFormatting
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={isToolbarReducedSpacing}
          pluginStateTextFormatting={textFormattingPluginState}
          pluginStateClearFormatting={clearFormattingPluginState}
          popupsMountPoint={popupsMountPoint}
          popupsScrollableElement={popupsScrollableElement}
        />
      </ButtonGroup>
    );
  },
});

export default textFormatting;
