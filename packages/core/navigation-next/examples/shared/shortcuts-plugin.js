// @flow

import React, { Component } from 'react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { NavAPISubscriber, navAPIUtils } from '../../src';

const appendShortcuts = navAPIUtils.appendToGroup('root/index:menu', [
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
]);

class Shortcuts extends Component<any> {
  componentDidMount() {
    const { navAPI } = this.props;
    navAPI.addReducer('root/index', this.shortcutsReducer, 'shortcuts');
  }

  shortcutsReducer = view => appendShortcuts(view);

  render() {
    return null;
  }
}

export default (props: any) => (
  <NavAPISubscriber>
    {navAPI => <Shortcuts {...props} navAPI={navAPI} />}
  </NavAPISubscriber>
);
