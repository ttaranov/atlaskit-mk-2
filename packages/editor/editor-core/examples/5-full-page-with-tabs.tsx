import * as React from 'react';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../apps/Tabs/document';
import { getTabsDefaultNode } from '../apps/Tabs/document';

export const tabsExtensionDefault = getTabsDefaultNode();

const quickInsertItems = [
  {
    title: 'Tabs',
    icon: () => <FolderIcon label="Tabs" />,
    action(insert) {
      return insert(tabsExtensionDefault);
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
    content: 'Tabs',
    value: { name: 'tabs' },
    tooltipDescription: 'Insert tabs!',
    tooltipPosition: 'right',
    elemBefore: <FolderIcon label="Tabs" />,
    onClick: function(editorActions) {
      editorActions.replaceSelection(tabsExtensionDefault);
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
