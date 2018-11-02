import { MediaSingleLayout, MediaSingleProps } from '@atlaskit/editor-common';
import { EditorState } from 'prosemirror-state';
import { EditorAppearance } from '../../../../types';
import { GridType } from '../../../grid/types';

export type EnabledHandles = { left?: boolean; right?: boolean };

export type Props = MediaSingleProps & {
  updateSize: (width: number | null, layout: MediaSingleLayout) => void;
  displayGrid: (show: boolean, type: GridType, highlight?: number[]) => void;
  getPos: () => number | undefined;
  state: EditorState;
  lineLength: number;
  gridSize: number;
  containerWidth: number;
  appearance: EditorAppearance;
};
