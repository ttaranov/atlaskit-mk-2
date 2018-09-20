import * as React from 'react';
import { Plugin } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin, Command } from '../../types';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-common';

export const stateKey = new PluginKey('gridPlugin');
import { GridPluginState } from './types';
import { pluginKey as widthPlugin, WidthPluginState } from '../width/index';
import WithPluginState from '../../ui/WithPluginState';

export const DEFAULT_GRID_SIZE = 12;

const calcGridSize = (width: number | undefined) => {
  return DEFAULT_GRID_SIZE;
};

export const displayGrid = (show: boolean): Command => {
  return (state, dispatch) => {
    dispatch(state.tr.setMeta(stateKey, show));
    return true;
  };
};

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
          visible: true,
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
        if (typeof meta !== 'undefined') {
          newVisible = meta;
        }

        if (
          newGridSize !== pluginState.gridSize ||
          newVisible !== pluginState.visible
        ) {
          const newPluginState = {
            gridSize: newGridSize,
            visible: newVisible,
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

  contentComponent: ({ editorView, appearance, containerElement }) => {
    return (
      <WithPluginState
        plugins={{
          grid: stateKey,
        }}
        render={({ grid }) => {
          if (!grid.visible || !grid.gridSize) {
            return null;
          }

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
            const widePace =
              (akEditorWideLayoutWidth - akEditorFullPageMaxWidth) / 2;
            ['left', 'right'].forEach(side =>
              gridLines.push(
                <div
                  key={side}
                  className="gridLine"
                  style={{ position: 'absolute', [side]: `-${widePace}px` }}
                />,
              ),
            );
          }

          return (
            <div className="gridParent">
              <div
                className="gridContainer"
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
