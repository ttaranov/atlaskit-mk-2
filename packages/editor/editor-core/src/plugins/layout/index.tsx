import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import { layoutSection, layoutColumn } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import {
  default as layoutPlugin,
  pluginKey,
  LayoutState,
} from './pm-plugins/main';
import { buildToolbar } from './toolbar';

export { pluginKey };

export default {
  nodes() {
    return [
      { name: 'layoutSection', node: layoutSection },
      { name: 'layoutColumn', node: layoutColumn },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'layout',
        plugin: () => layoutPlugin,
      },
    ];
  },
  pluginsOptions: {
    floatingToolbar(state): FloatingToolbarConfig | undefined {
      const { pos } = pluginKey.getState(state) as LayoutState;
      if (pos !== null) {
        return buildToolbar(state, pos);
      }
      return undefined;
    },
    quickInsert: [
      {
        title: 'Columns',
        keywords: ['layout', 'section'],
        priority: 1100,
        icon: () => <LayoutTwoEqualIcon label="Insert columns" />,
        action(insert, state) {
          const { layoutSection } = state.schema.nodes;
          return insert(layoutSection.createAndFill() as PMNode);
        },
      },
    ],
  },
} as EditorPlugin;
