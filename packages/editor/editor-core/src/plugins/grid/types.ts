export type GridPluginState = {
  gridSize: number;
  visible: boolean;
  gridType: GridType;
  highlight: number[];
};

export type GridType = 'full' | 'wrapped';
