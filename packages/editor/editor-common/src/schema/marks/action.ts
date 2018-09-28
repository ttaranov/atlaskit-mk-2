import { MarkSpec } from 'prosemirror-model';
import { LINK, COLOR } from '../groups';

/**
 * @name action_mark
 */
export interface ActionDefinition {
  type: 'action';
  attrs: ActionMarkAttributes;
}

export interface ActionMarkAttributes extends Action {
  title: string;
}

export interface Action {
  key?: string;
  target: {
    receiver?: string;
    key: string;
  };
  parameters?: object;
}

export const action: MarkSpec = {
  excludes: COLOR,
  group: LINK,
  attrs: {
    key: { default: null },
    title: { default: null },
    target: { default: null },
    parameters: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'span[data-mark-type="action"]',
      getAttrs: dom => {
        const key = (dom as Element).getAttribute('data-action-mark-key');
        const targetReceiver = (dom as Element).getAttribute(
          'data-action-mark-target-receiver',
        );
        const targetKey = (dom as Element).getAttribute(
          'data-action-mark-target-key',
        );
        const title = (dom as Element).getAttribute('data-action-mark-title');

        return {
          key,
          title,
          target: {
            receiver: targetReceiver,
            key: targetKey,
          },
        };
      },
    },
  ],
  toDOM(node) {
    const { title, key, target } = node.attrs;
    return [
      'span',
      {
        'data-mark-type': 'action',
        'data-action-mark-key': key,
        'data-action-mark-title': title,
        'data-action-mark-target-receiver': target && target.receiver,
        'data-action-mark-target-key': target && target.key,
      },
    ];
  },
};
