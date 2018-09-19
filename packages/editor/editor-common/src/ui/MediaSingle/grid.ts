import { MediaSingleLayout } from '../../schema';

const handleMargin = 12;
const gutterSize = handleMargin * 2;

export const validResizeModes: MediaSingleLayout[] = [
  'center',
  'wide',
  'full-width',
];

export const validWidthModes: MediaSingleLayout[] = [
  'center',
  'wrap-left',
  'wrap-right',
];

// comment editor:
// 16px margin on all 4 sides (on .ak-editor-content-area)
// 20px on left-right  (on .ProseMirror)
// we only care about the .ProseMirror margins

export function calcPxFromColumns(
  columns: number,
  lineLength: number,
  gridSize: number,
): number {
  const maxWidth = lineLength + gutterSize;
  return maxWidth / gridSize * columns - gutterSize;
}

export function calcColumnsFromPx(
  width: number,
  lineLength: number,
  gridSize: number,
): number {
  // const gridWidth =
  //   appearance === 'full-page'
  //     ? FULLPAGE_GRID_WIDTH
  //     : containerWidth - 16 /* (20 - 12) * 2 */;

  const maxWidth = lineLength + gutterSize;
  return (width + gutterSize) * gridSize / maxWidth;
}

export function calcPxFromPct(pct: number, lineLength: number): number {
  const maxWidth = lineLength + gutterSize;
  return maxWidth * pct - gutterSize;
}

export function calcPctFromPx(width: number, lineLength: number): number {
  const maxWidth = lineLength + gutterSize;
  const res = (width + gutterSize) / maxWidth;

  return res;
}

export const snapToGrid = (gridWidth, width, height, lineLength, gridSize) => {
  const pxWidth = calcPxFromPct(gridWidth / 100, lineLength);

  const columnSpan = Math.round(
    calcColumnsFromPx(pxWidth, lineLength, gridSize),
  );

  const alignedWidth = calcPxFromColumns(columnSpan, lineLength, gridSize);

  return {
    height: height / width * alignedWidth,
    width: alignedWidth,
  };
};
