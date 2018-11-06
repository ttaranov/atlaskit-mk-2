import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import EditorErrorIcon from '@atlaskit/icon/glyph/editor/error';
import EditorSuccessIcon from '@atlaskit/icon/glyph/editor/success';
import EditorNoteIcon from '@atlaskit/icon/glyph/editor/note';
import { panel, PanelType } from '@atlaskit/editor-common';

import { EditorPlugin } from '../../types';
import { messages } from '../block-type/types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

import keymap from './pm-plugins/keymaps';
import { EditorState } from 'prosemirror-state';

const insertPanelType = (panelType: PanelType, state: EditorState) =>
  state.schema.nodes.panel.createChecked(
    { panelType },
    state.schema.nodes.paragraph.createChecked(),
  );

const panelPlugin: EditorPlugin = {
  nodes() {
    return [{ name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [
      { name: 'panel', plugin: createPlugin },
      {
        name: 'panelKeyMap',
        plugin: () => keymap(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.panel),
        keywords: ['info'],
        priority: 900,
        icon: () => <InfoIcon label={formatMessage(messages.panel)} />,
        action(insert, state) {
          return insert(insertPanelType('info', state));
        },
      },
      {
        title: formatMessage(messages.notePanel),
        keywords: ['note'],
        priority: 1000,
        icon: () => (
          <EditorNoteIcon label={formatMessage(messages.notePanel)} />
        ),
        action(insert, state) {
          return insert(insertPanelType('note', state));
        },
      },
      {
        title: formatMessage(messages.successPanel),
        keywords: ['success'],
        priority: 1000,
        icon: () => (
          <EditorSuccessIcon label={formatMessage(messages.successPanel)} />
        ),
        action(insert, state) {
          return insert(insertPanelType('success', state));
        },
      },
      {
        title: formatMessage(messages.warningPanel),
        keywords: ['warning'],
        priority: 1000,
        icon: () => (
          <EditorWarningIcon label={formatMessage(messages.warningPanel)} />
        ),
        action(insert, state) {
          return insert(insertPanelType('warning', state));
        },
      },
      {
        title: formatMessage(messages.errorPanel),
        keywords: ['error'],
        priority: 1000,
        icon: () => (
          <EditorErrorIcon label={formatMessage(messages.errorPanel)} />
        ),
        action(insert, state) {
          return insert(insertPanelType('error', state));
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
};

export default panelPlugin;
