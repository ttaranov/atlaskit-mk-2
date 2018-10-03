import * as React from 'react';
import { Plugin } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin, Command } from '../../types';
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

export const DEFAULT_GRID_SIZE = 12;

const calcGridSize = (width: number | undefined) => {
  return DEFAULT_GRID_SIZE;
};

export const displayGrid = (show: boolean, type: GridType): Command => {
  return (state, dispatch) => {
    dispatch(
      state.tr.setMeta(stateKey, {
        visible: show,
        gridType: type,
      }),
    );
    return true;
  };
};

export const gridTypeForLayout = (layout: MediaSingleLayout): GridType =>
  layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';

export const createPlugin = ({ dispatch }) =>
  new Plugin({
    key: stateKey,
    state: {
      init: (_, state): GridPluginState => {
        const editorWidth = widthPlugin.getState(state) as WidthPluginState;
        return {
          gridSize: editorWidth
            ? calcGridSize(editorWidth.width)
            : DEFAULT_GRID_SIZE,
          visible: false,
          gridType: 'full',
        };
      },
      apply: (tr, pluginState: GridPluginState, oldState, newState) => {
        let newGridSize = pluginState.gridSize;

        // check to see if we have to change the grid size
        const newWidth = tr.getMeta(widthPlugin);
        if (typeof newWidth !== 'undefined') {
          // have broadcasted new width, try to recalculate grid size
          newGridSize = calcGridSize(newWidth);
        }

        const meta = tr.getMeta(stateKey);
        let newVisible = pluginState.visible;
        let newGridType = pluginState.gridType;
        if (typeof meta !== 'undefined') {
          newVisible = meta.visible;
          newGridType = meta.gridType || 'full';
        }

        if (
          newGridSize !== pluginState.gridSize ||
          newVisible !== pluginState.visible ||
          newGridType !== pluginState.gridType
        ) {
          const newPluginState = {
            gridSize: newGridSize,
            visible: newVisible,
            gridType: newGridType,
          };

          dispatch(stateKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      },
    },
  });

const gridPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ name: 'grid', plugin: createPlugin }];
  },

  contentComponent: ({
    editorView: { state: editorState },
    appearance,
    containerElement,
  }) => {
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
          grid: GridPluginState;
          widthState?: WidthPluginState;
        }) => {
          if (!grid.visible || !grid.gridSize) {
            return null;
          }

          const editorMaxWidth = mapBreakpointToLayoutMaxWidth(
            getBreakpoint(widthState.width),
          );

          const gridLines: JSX.Element[] = [];
          const gridSpacing = 100 / grid.gridSize;

          for (let i = 0; i < grid.gridSize; i++) {
            gridLines.push(
              <div
                key={i}
                className="gridLine"
                style={{ paddingLeft: `${gridSpacing}%` }}
              />,
            );
          }

          // wide grid lines
          if (appearance === 'full-page') {
            const wideSpacing = (akEditorWideLayoutWidth - editorMaxWidth) / 2;
            ['left', 'right'].forEach(side =>
              gridLines.push(
                <div
                  key={side}
                  className="gridLine"
                  style={{ position: 'absolute', [side]: `-${wideSpacing}px` }}
                />,
              ),
            );
          }

          return (
            <div className="gridParent">
              <div
                className={`gridContainer ${grid.gridType}`}
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
