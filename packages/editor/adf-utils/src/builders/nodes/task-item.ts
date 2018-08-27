import { Inline, TaskItemDefinition } from '@atlaskit/editor-common';

export const taskItem = (attrs: TaskItemDefinition['attrs']) => (
  ...content: Array<Inline>
): TaskItemDefinition => ({
  type: 'taskItem',
  attrs,
  content,
});
