import * as React from 'react';
import { default as FullPageExample } from './5-full-page';
import GraphBarIcon from '@atlaskit/icon/glyph/graph-bar';
import { exampleDocument, getPollDefaultNode } from '../apps/Poll/document';

const quickInsertItems = [
  {
    title: 'Poll',
    icon: () => <GraphBarIcon label="Poll" />,
    action(insert) {
      return insert(getPollDefaultNode());
    },
  },
];

function quickInsertProviderFactory() {
  return {
    getItems() {
      return new Promise(resolve => {
        setTimeout(() => resolve(quickInsertItems), 1000);
      });
    },
  };
}

const insertMenuItems = [
  {
    content: 'Poll',
    value: { name: 'poll' },
    tooltipDescription: 'Polly!',
    tooltipPosition: 'right',
    elemBefore: <GraphBarIcon label="Poll" />,
    onClick: function(editorActions) {
      editorActions.replaceSelection(getPollDefaultNode());
    },
  },
];

const quickInsert = { provider: Promise.resolve(quickInsertProviderFactory()) };

export default function Example() {
  return FullPageExample({
    defaultValue: exampleDocument,
    insertMenuItems,
    quickInsert,
  });
}
