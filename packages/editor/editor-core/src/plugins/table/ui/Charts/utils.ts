import { EditorState } from 'prosemirror-state';
import {
  akColorB300,
  akColorR300,
  akColorY300,
  akColorG300,
  akColorP300,
  akColorT300,
  akColorN300,
  akColorP200,
  akColorG200,
  akColorR200,
  akColorY200,
  akColorB200,
  akColorN200,
  akColorT200,
} from '@atlaskit/util-shared-styles';
import { pluginKey } from '../../pm-plugins/main';

const getPixelRatio = () => {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return devicePixelRatio / backingStoreRatio;
};

export const COLORS = [
  akColorP300,
  akColorG300,
  akColorR300,
  akColorY300,
  akColorB300,
  akColorT300,
  akColorN300,
];

export const SELECTED_COLORS = [
  akColorP200,
  akColorG200,
  akColorR200,
  akColorY200,
  akColorB200,
  akColorT200,
  akColorN200,
];

export const degreesToRadians = (degs: number) => {
  return degs / 360 * (2 * Math.PI);
};

// @see https://www.html5rocks.com/en/tutorials/canvas/hidpi/
export const upscaleCanvas = (
  canvasRef: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const pixelRatio = getPixelRatio();

  if (pixelRatio !== 1) {
    const ctx = canvasRef.getContext('2d')!;
    canvasRef.width = canvasWidth * pixelRatio;
    canvasRef.height = canvasHeight * pixelRatio;
    canvasRef.style.width = canvasWidth + 'px';
    canvasRef.style.height = canvasHeight + 'px';
    ctx.scale(pixelRatio, pixelRatio);
  }
};

export const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export const isTimelineAvailable = (state: EditorState) => {
  const { tableNode } = pluginKey.getState(state);

  const firstRow = tableNode.child(0);
  for (let columnIndex = 0; columnIndex < firstRow.childCount; columnIndex++) {
    const cell = firstRow.child(columnIndex);
    if (cell.attrs.cellType === 'date') {
      return true;
    }
  }

  return false;
};

export const isNumberChartAvailable = (state: EditorState) => {
  const { tableNode } = pluginKey.getState(state);

  const firstRow = tableNode.child(0);
  for (let columnIndex = 0; columnIndex < firstRow.childCount; columnIndex++) {
    const cell = firstRow.child(columnIndex);
    if (cell.attrs.cellType === 'number') {
      return true;
    }
  }

  return false;
};
