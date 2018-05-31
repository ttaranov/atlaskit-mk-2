import { Node, Schema } from 'prosemirror-model';

interface GraphTransformer {
  toChart: () => object;
  fromChart: (chartData: object, schema: Schema) => Node;
}

type NumberChartEntry = {
  title: string;
  values: number[];
};

type NumberChartDataset = {
  legend: string[];
  entries: NumberChartEntry[];
};

type TimelineEntry = {
  start: number;
  end: number;
  title: string;
};

type TimelineDataset = {
  entries: TimelineEntry[];
};

type ChartSetting = {
  name: string;
  title: string;
  for: 'transformer' | 'component';
  input: 'column-select' | 'checkbox';

  dataIdx?: number;
};

type ChartSettings = ChartSetting[];

export {
  GraphTransformer,
  NumberChartDataset,
  NumberChartEntry,
  TimelineEntry,
  TimelineDataset,
  ChartSetting,
  ChartSettings,
};
