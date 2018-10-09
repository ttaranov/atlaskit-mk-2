export type GridPluginState = {
  gridSize: number;
  visible: boolean;
  gridType: GridType;
};

export type GridType = 'full' | 'wrapped';
