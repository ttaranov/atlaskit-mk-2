import { Node, NodeSpec } from 'prosemirror-model';
import { Inline } from './doc';
import { uuid } from '../../utils';

/**
 * @name taskItem_node
 */
export interface TaskItemDefinition {
  type: 'taskItem';
  /**
   * @allowUnsupportedInline true
   */
  content: Array<Inline>;
  attrs: {
    localId: string;
    state: 'TODO' | 'DONE';
  };
}

export const taskItem: NodeSpec = {
  content: 'inline*',
  defining: true,
  marks: '_',
  attrs: {
    localId: { default: '' },
    state: { default: 'TODO' },
  },
  parseDOM: [
    {
      tag: 'li[data-task-local-id]',

      // Default priority is 50. We normally don't change this but since this node type is
      // also used by list-item we need to make sure that we run this parser first.
      priority: 100,

      getAttrs: (dom: Element) => ({
        localId: uuid.generate(),
        state: dom.getAttribute('data-task-state')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const { localId, state } = node.attrs;
    const attrs = {
      'data-task-local-id': localId || 'local-task',
      'data-task-state': state,
    };
    return ['li', attrs, 0];
  },
};
