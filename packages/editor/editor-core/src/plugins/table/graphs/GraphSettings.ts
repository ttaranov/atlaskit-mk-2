import { ChartSettings } from '.';

export const TimelineSettings: ChartSettings = [
  {
    name: 'start',
    title: 'Start date',
    for: 'transformer',
    input: 'column-select',
    dataIdx: 0,
  },
  {
    name: 'end',
    title: 'End date',
    for: 'transformer',
    input: 'column-select',
    dataIdx: 1,
  },
  {
    name: 'gridlines',
    title: 'Show grid lines',
    for: 'component',
    input: 'checkbox',
  },
];

export const DonutSettings: ChartSettings = [
  {
    name: 'values',
    title: 'Values',
    for: 'transformer',
    input: 'column-select',
    dataIdx: 0,
  },
];
