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
import { messages as insertBlockMessages } from '../insert-block/ui/ToolbarInsertBlock';
import { createPlugin } from './pm-plugins/main';
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
      { name: 'decisionList', node: decisionList },
      { name: 'decisionItem', node: decisionItem },
      { name: 'taskList', node: taskList },
      { name: 'taskItem', node: taskItem },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'tasksAndDecisions',
        plugin: ({ schema, props, portalProviderAPI, providerFactory }) => {
          return createPlugin(portalProviderAPI, providerFactory);
        },
      },
      {
        name: 'tasksAndDecisionsInputRule',
        plugin: ({ schema }) => inputRulePlugin(schema),
      },
      {
        name: 'tasksAndDecisionsKeyMap',
        plugin: ({ schema }) => keymap(schema),
      }, // Needs to be after "save-on-enter"
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
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(insertBlockMessages.action),
        priority: 100,
        keywords: ['task'],
        icon: () => (
          <EditorTaskIcon label={formatMessage(insertBlockMessages.action)} />
        ),
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
        title: formatMessage(insertBlockMessages.decision),
        priority: 900,
        icon: () => (
          <EditorDecisionIcon
            label={formatMessage(insertBlockMessages.decision)}
          />
        ),
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
