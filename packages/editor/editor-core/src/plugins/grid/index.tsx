import * as React from 'react';
import * as classnames from 'classnames';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  MediaSingleLayout,
  mapBreakpointToLayoutMaxWidth,
  getBreakpoint,
  akEditorBreakoutPadding,
} from '@atlaskit/editor-common';

import { GridPluginState, GridType } from './types';
import { pluginKey as widthPlugin, WidthPluginState } from '../width/index';
import WithPluginState from '../../ui/WithPluginState';
import { EventDispatcher, createDispatch } from '../../event-dispatcher';

export const stateKey = new PluginKey('gridPlugin');
export const GRID_SIZE = 12;

export const createDisplayGrid = (eventDispatcher: EventDispatcher) => {
  const dispatch = createDispatch(eventDispatcher);
  return (show: boolean, type: GridType, highlight: number[] = []) => {
    return dispatch(stateKey, {
      visible: show,
      gridType: type,
      highlight: highlight,
    } as GridPluginState);
  };
};

export const gridTypeForLayout = (layout: MediaSingleLayout): GridType =>
  layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';

type Side = 'left' | 'right';
const sides: Side[] = ['left', 'right'];

const overflowHighlight = (
  highlights: number[],
  side: Side,
  start: number,
  size?: number,
) => {
  if (!highlights.length) {
    return false;
  }

  const minHighlight = highlights.reduce((prev, cur) => Math.min(prev, cur));
  const maxHighlight = highlights.reduce((prev, cur) => Math.max(prev, cur));

  if (side === 'left') {
    return (
      minHighlight < 0 &&
      minHighlight <= -start &&
      (typeof size === 'number' ? minHighlight >= -(start + size) : true)
    );
  } else {
    return (
      maxHighlight > GRID_SIZE &&
      maxHighlight >= GRID_SIZE + start &&
      (typeof size === 'number' ? maxHighlight <= GRID_SIZE + size : true)
    );
  }
};

const gutterGridLines = (
  appearance,
  editorMaxWidth,
  editorWidth,
  highlights,
): JSX.Element[] => {
  const gridLines: JSX.Element[] = [];
  if (appearance !== 'full-page') {
    return gridLines;
  }

  const wideSpacing = (akEditorWideLayoutWidth - editorMaxWidth) / 2;
  sides.forEach(side => {
    gridLines.push(
      <div
        key={side}
        className={classnames(
          'gridLine',
          overflowHighlight(highlights, side, 0, 2) ? 'highlight' : '',
        )}
        style={{ position: 'absolute', [side]: `-${wideSpacing}px` }}
      />,
    );

    gridLines.push(
      <div
        key={side + '-bk'}
        className={classnames(
          'gridLine',
          overflowHighlight(highlights, side, 3) ? 'highlight' : '',
        )}
        style={{
          position: 'absolute',
          [side]: `-${(editorWidth - editorMaxWidth - akEditorBreakoutPadding) /
            2}px`,
        }}
      />,
    );
  });

  return gridLines;
};

const gridPlugin: EditorPlugin = {
  contentComponent: ({ editorView, appearance, containerElement }) => {
    return (
      <WithPluginState
        plugins={{
          grid: stateKey,
          widthState: widthPlugin,
        }}
        render={({
          grid,
          widthState = { width: akEditorFullPageMaxWidth },
        }: {
          grid?: GridPluginState;
          widthState?: WidthPluginState;
        }) => {
          if (!grid) {
            return null;
          }

          const editorMaxWidth = mapBreakpointToLayoutMaxWidth(
            getBreakpoint(widthState.width),
          );

          const gridLines: JSX.Element[] = [];
          const gridSpacing = 100 / GRID_SIZE;

          for (let i = 0; i <= GRID_SIZE; i++) {
            const style = {
              paddingLeft: `${gridSpacing}%`,
            };
            gridLines.push(
              <div
                key={i}
                className={classnames(
                  'gridLine',
                  grid.highlight.indexOf(i) > -1 ? 'highlight' : '',
                )}
                style={i < GRID_SIZE ? style : undefined}
              />,
            );
          }

          const gutterLines = gutterGridLines(
            appearance,
            editorMaxWidth,
            widthState.width,
            grid.highlight,
          );

          return (
            <div className="gridParent">
              <div
                className={classnames(
                  'gridContainer',
                  grid.gridType,
                  !grid.visible ? 'hidden' : '',
                )}
                style={{
                  height: containerElement
                    ? `${containerElement.scrollHeight}px`
                    : undefined,
                }}
              >
                {gridLines.concat(gutterLines)}
              </div>
            </div>
          );
        }}
      />
    );
  },
};

export default gridPlugin;
export { GRID_GUTTER } from './styles';
