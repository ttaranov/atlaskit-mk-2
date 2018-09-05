import * as React from 'react';
import { Plugin } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
} from '@atlaskit/editor-common';

export const stateKey = new PluginKey('gridPlugin');

export const GRID_SIZE = 12;

export const createPlugin = () =>
  new Plugin({
    key: stateKey,
  });

const gridPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ name: 'grid', plugin: () => createPlugin() }];
  },

  contentComponent: ({ appearance, containerElement }) => {
    // TODO: use WithPluginState and conditionally render grid
    //
    // this should also fix case where we don't receive events for containerElement's
    // scrolHeight changing, since we'd always re-render if we reflowed the content anyway
    // and receive the updatd height

    const gridLines: JSX.Element[] = [];
    const gridPace = 100 / GRID_SIZE;

    for (let i = 0; i < GRID_SIZE; i++) {
      gridLines.push(
        <div className="gridLine" style={{ paddingLeft: `${gridPace}%` }} />,
      );
    }

    // wide grid lines
    const widePace = (akEditorWideLayoutWidth - akEditorFullPageMaxWidth) / 2;
    ['left', 'right'].forEach(side =>
      gridLines.push(
        <div
          className="gridLine"
          style={{ position: 'absolute', [side]: `-${widePace}px` }}
        />,
      ),
    );

    return (
      <div className={`gridParent gridParent-${appearance}`}>
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
  },
};

export default gridPlugin;
