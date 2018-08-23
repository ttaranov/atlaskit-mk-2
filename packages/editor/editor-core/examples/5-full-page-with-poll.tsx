import * as React from 'react';
import { default as FullPageExample } from './5-full-page';
import GraphBarIcon from '@atlaskit/icon/glyph/graph-bar';
import { exampleDocument } from '../apps/Poll/document';

const pollExtensionDefault = {
  type: 'extension',
  attrs: {
    extensionType: 'com.atlassian.editor.apps.core',
    extensionKey: 'poll',
    parameters: {
      id: '123',
      title: 'Tabs or spaces?',
      choices: [
        {
          id: '1',
          value: 'Tabs',
        },
        {
          id: '2',
          value: 'Spaces',
        },
      ],
      createDate: 1534859278962,
      finishDate: 1535551200000,
    },
  },
};

const quickInsertItems = [
  {
    title: 'Poll',
    icon: () => <GraphBarIcon label="Poll" />,
    action(insert) {
      return insert(pollExtensionDefault);
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
      editorActions.replaceSelection(pollExtensionDefault);
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
