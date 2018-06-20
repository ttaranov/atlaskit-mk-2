import * as React from 'react';
import styled from 'styled-components';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorDecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import {
  decisionItem,
  decisionList,
  taskItem,
  taskList,
  uuid,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import pastePlugin from './pm-plugins/paste-plugin';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap from './pm-plugins/keymaps';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';

// tslint:disable-next-line:variable-name
const TaskDecisionToolbarGroup = styled.div`
  display: flex;
`;

const tasksAndDecisionsPlugin: EditorPlugin = {
  nodes() {
    return [
      { name: 'decisionList', node: decisionList, rank: 1800 },
      { name: 'decisionItem', node: decisionItem, rank: 1900 },
      { name: 'taskList', node: taskList, rank: 2000 },
      { name: 'taskItem', node: taskItem, rank: 2100 },
    ];
  },

  pmPlugins() {
    return [
      { rank: 50, plugin: () => pastePlugin() }, // must before default paste plugin
      {
        rank: 500,
        plugin: ({ schema, props, portalProviderAPI, providerFactory }) => {
          const { delegateAnalyticsEvent } = props;
          return createPlugin(
            portalProviderAPI,
            { delegateAnalyticsEvent },
            providerFactory,
          );
        },
      },
      { rank: 510, plugin: ({ schema }) => inputRulePlugin(schema) },
      { rank: 9800, plugin: ({ schema }) => keymap(schema) }, // Needs to be after "save-on-enter"
    ];
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <TaskDecisionToolbarGroup>
        <ToolbarDecision
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={true}
        />
        <ToolbarTask
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={true}
        />
      </TaskDecisionToolbarGroup>
    );
  },

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Action',
        keywords: ['task'],
        icon: () => <EditorTaskIcon label="Action" />,
        action(insert, state) {
          return insert(
            state.schema.nodes.taskList.createChecked(
              { localId: uuid.generate() },
              state.schema.nodes.taskItem.createChecked({
                localId: uuid.generate(),
              }),
            ),
          );
        },
      },
      {
        title: 'Decision',
        icon: () => <EditorDecisionIcon label="Insert Decision" />,
        action(insert, state) {
          return insert(
            state.schema.nodes.decisionList.createChecked(
              { localId: uuid.generate() },
              state.schema.nodes.decisionItem.createChecked({
                localId: uuid.generate(),
              }),
            ),
          );
        },
      },
    ],
  },
};

export default tasksAndDecisionsPlugin;
