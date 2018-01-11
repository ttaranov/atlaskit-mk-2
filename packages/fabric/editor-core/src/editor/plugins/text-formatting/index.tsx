import * as React from 'react';
import {
  em,
  strong,
  strike,
  subsup,
  underline,
  code,
} from '@atlaskit/editor-common';
import styled from 'styled-components';
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

// tslint:disable-next-line:variable-name
const ButtonsGroup = styled.div`
  display: flex;

  & > * {
    margin-left: ${({ width }) => (width === 'large' ? 0 : 4)}px;
  }

  & > *:first-child {
    margin-left: 0;
  }
`;

export interface TextFormattingOptions {
  disableSuperscriptAndSubscript?: boolean;
  disableUnderline?: boolean;
}

const textFormatting = (options: TextFormattingOptions = {}): EditorPlugin => ({
  marks() {
    return [
      { name: 'em', mark: em, rank: 200 },
      { name: 'strong', mark: strong, rank: 300 },
      { name: 'strike', mark: strike, rank: 400 },
      { name: 'code', mark: code, rank: 700 },
    ]
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
      <ButtonsGroup width={isToolbarReducedSpacing ? 'small' : 'large'}>
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
        />
      </ButtonsGroup>
    );
  },
});

export default textFormatting;
