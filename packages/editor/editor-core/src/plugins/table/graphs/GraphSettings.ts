import { ChartSettings } from '.';

export const TimelineSettings: ChartSettings = [
  {
    name: 'gridlines',
    title: 'Show grid lines',
    for: 'component',
    input: 'checkbox',
  },
  {
    name: 'showTable',
    title: 'Show table',
    for: 'component',
    input: 'checkbox',
  },
];

export const DonutSettings: ChartSettings = [
  {
    name: 'legendAlignment',
    title: 'Legend alignment',
    for: 'component',
    input: 'select',
    values: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' },
    ],
  },
  {
    name: 'title',
    title: 'Show title',
    for: 'component',
    input: 'title',
  },
  {
    name: 'showTable',
    title: 'Show table',
    for: 'component',
    input: 'checkbox',
  },
];
