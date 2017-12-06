// @flow
import { type StatelessTabs, type StatefulTabs } from '../src/types';

const sampleTabsNoSelection: StatelessTabs = [
  {
    content: 'Tab 1 content',
    label: 'Tab 1 label',
    onSelect: () => {},
  },
  {
    content: 'Tab 2 content',
    label: 'Tab 2 label',
    onSelect: () => {},
  },
  {
    content: 'Tab 3 content',
    label: 'Tab 3 label',
    onSelect: () => {},
  },
];

const sampleTabsDefaultSelected: StatefulTabs = [
  {
    content: 'Tab 1 content',
    label: 'Tab 1 label',
  },
  {
    content: 'Tab 2 content',
    label: 'Tab 2 label',
    defaultSelected: true,
  },
  {
    content: 'Tab 3 content',
    label: 'Tab 3 label',
  },
];

const sampleTabs: StatelessTabs = sampleTabsNoSelection.map(item => ({
  ...item,
}));
sampleTabs[1].isSelected = true;

const sampleTabsNoDefault: StatefulTabs = sampleTabsDefaultSelected.filter(
  item => item.defaultSelected == null,
);

// const sampleTabsDefaultSelected = sampleTabsNoSelection.map(item => ({ ...item }));
// sampleTabsDefaultSelected[1].defaultSelected = true;

export {
  sampleTabs,
  sampleTabsNoSelection,
  sampleTabsDefaultSelected,
  sampleTabsNoDefault,
};
