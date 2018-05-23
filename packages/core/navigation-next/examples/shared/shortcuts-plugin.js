// @flow

import React, { Component } from 'react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { NavAPISubscriber } from '../../src';

const applyPlugin = (pluginName, group, pluginItems) =>
  group.map(item => {
    let items = item.items || [];
    if (item.type === 'PluginPoint' && item.name === pluginName) {
      items = [...(item.items || []), ...pluginItems];
    }
    return { ...item, items };
  });

const insertItemsInSystemTopNavigationBar = (...args) =>
  applyPlugin('shortcuts-plugin', ...args);

class Shortcuts extends Component<any> {
  componentDidMount() {
    const { navAPI } = this.props;

    navAPI.addReducer('root-home', this.shortcutsReducer, 'shortcuts');
  }

  shortcutsReducer = data => ({
    ...data,
    view: insertItemsInSystemTopNavigationBar(data.view, [
      {
        id: 'shortcut-separator',
        key: 'shortcut-separator',
        type: 'Separator',
      },
      {
        icon: ShortcutIcon,
        id: 'shortcut-1',
        key: 'shortcut-1',
        type: 'Item',
        text: 'Shortcut 1',
      },
      {
        icon: ShortcutIcon,
        id: 'shortcut-2',
        key: 'shortcut-2',
        type: 'Item',
        text: 'Shortcut 2',
      },
    ]),
  });

  render() {
    return null;
  }
}

export default (props: any) => (
  <NavAPISubscriber>
    {navAPI => <Shortcuts {...props} navAPI={navAPI} />}
  </NavAPISubscriber>
);
