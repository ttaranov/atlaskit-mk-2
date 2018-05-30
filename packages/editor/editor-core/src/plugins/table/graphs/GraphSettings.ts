import { ChartSettings } from '.';

export const TimelineSettings: ChartSettings = [
  {
    title: 'Start date',
    for: 'transformer',
    input: 'column-select',
    dataIdx: 0,
  },
  { title: 'End date', for: 'transformer', input: 'column-select', dataIdx: 1 },
  { title: 'Show grid lines', for: 'component', input: 'checkbox' },
];

export const DonutSettings: ChartSettings = [
  { title: 'Values', for: 'transformer', input: 'column-select', dataIdx: 0 },
];
