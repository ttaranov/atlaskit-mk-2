import * as React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  MediaSingleLayout,
  mapBreakpointToLayoutMaxWidth,
  getBreakpoint,
} from '@atlaskit/editor-common';

export const stateKey = new PluginKey('gridPlugin');
import { GridPluginState, GridType } from './types';
import { pluginKey as widthPlugin, WidthPluginState } from '../width/index';
import WithPluginState from '../../ui/WithPluginState';
import { EventDispatcher, createDispatch } from '../../event-dispatcher';

export const DEFAULT_GRID_SIZE = 12;

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
          const gridSpacing = 100 / DEFAULT_GRID_SIZE;

          for (let i = 0; i <= DEFAULT_GRID_SIZE; i++) {
            const style = {
              paddingLeft: `${gridSpacing}%`,
            };
            gridLines.push(
              <div
                key={i}
                className={`gridLine ${
                  grid.highlight.indexOf(i) > -1 ? 'highlight' : ''
                }`}
                style={i < DEFAULT_GRID_SIZE ? style : undefined}
              />,
            );
          }

          // wide grid lines
          if (appearance === 'full-page') {
            const wideSpacing = (akEditorWideLayoutWidth - editorMaxWidth) / 2;
            ['left', 'right'].forEach(side => {
              const highlight =
                grid.highlight.length &&
                (side === 'left'
                  ? grid.highlight[0] < 0 && grid.highlight[0] > -4
                  : grid.highlight[grid.highlight.length - 1] >
                      DEFAULT_GRID_SIZE &&
                    grid.highlight[grid.highlight.length - 1] <
                      DEFAULT_GRID_SIZE + 4);
              gridLines.push(
                <div
                  key={side}
                  className={`gridLine ${highlight ? 'highlight' : ''}`}
                  style={{ position: 'absolute', [side]: `-${wideSpacing}px` }}
                />,
              );
            });
          }

          return (
            <div className="gridParent">
              <div
                className={`gridContainer ${grid.gridType} ${
                  !grid.visible ? 'hidden' : ''
                }`}
                style={{
                  height: containerElement
                    ? `${containerElement.scrollHeight}px`
                    : undefined,
                }}
              >
                {gridLines}
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
