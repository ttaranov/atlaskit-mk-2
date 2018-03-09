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
import {
  plugin as textFormattingPlugin,
  stateKey as textFormattingStateKey,
} from '../../../plugins/text-formatting';
import {
  plugin as clearFormattingPlugin,
  stateKey as clearFormattingStateKey,
} from '../../../plugins/clear-formatting';
import textFormattingInputRulePlugin from '../../../plugins/text-formatting/input-rule';
import clearFormattingKeymapPlugin from '../../../plugins/clear-formatting/keymap';
import ToolbarTextFormatting from '../../../ui/ToolbarTextFormatting';
import ToolbarAdvancedTextFormatting from '../../../ui/ToolbarAdvancedTextFormatting';
import { ButtonGroup } from '../../../ui/styles';

export interface TextFormattingOptions {
  disableSuperscriptAndSubscript?: boolean;
  disableUnderline?: boolean;
  disableCode?: boolean;
}

const textFormatting: EditorPlugin = {
  marks({ allowTextFormatting, textFormatting }) {
    const options = textFormatting
      ? textFormatting
      : allowTextFormatting === true || !allowTextFormatting
        ? {}
        : allowTextFormatting;

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
      {
        rank: 810,
        plugin: ({ schema }) => textFormattingInputRulePlugin(schema),
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
};

export default textFormatting;
