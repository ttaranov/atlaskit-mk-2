import * as React from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import DateIcon from '@atlaskit/icon/glyph/editor/date';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import { createTableNode } from '../table/utils';
import { EditorPlugin } from '../../types';
import { find } from './search';

const ITEMS = [
  {
    title: 'Panel',
    icon: () => <InfoIcon label="Insert Panel" />,
    action(state, replaceWith) {
      return replaceWith(
        state.schema.nodes.panel.createChecked(
          {},
          state.schema.nodes.paragraph.createChecked(),
        ),
      );
    },
  },
  {
    title: 'Table',
    icon: () => <TableIcon label="Insert table" />,
    action(state, replaceWith) {
      return replaceWith(createTableNode(3, 3, state.schema));
    },
  },
  {
    title: 'Date',
    icon: () => <DateIcon label="Insert Date" />,
    action(state, replaceWith) {
      return replaceWith(
        state.schema.nodes.date.createChecked({ timestamp: Date.now() }),
      );
    },
  },
  {
    title: 'Browse all...',
    action() {
      document.location.href = 'https://atlassian.com';
      return true;
    },
  },
];

const quickInsertPlugin: EditorPlugin = {
  pluginsOptions: {
    typeAhead: {
      trigger: '/',
      getItems(query) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(find(query, ITEMS, item => item.title));
          }, 100);
        });
      },
      selectItem: (state, item, replaceWith) => {
        return item.action(state, replaceWith);
      },
    },
  },
};

export default quickInsertPlugin;
