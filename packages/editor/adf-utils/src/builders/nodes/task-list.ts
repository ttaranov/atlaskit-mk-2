import {
  TaskListDefinition,
  TaskItemDefinition,
} from '@atlaskit/editor-common';

export const taskList = (attrs: TaskListDefinition['attrs']) => (
  ...content: Array<TaskItemDefinition>
): TaskListDefinition => ({
  type: 'taskList',
  attrs,
  content,
});
