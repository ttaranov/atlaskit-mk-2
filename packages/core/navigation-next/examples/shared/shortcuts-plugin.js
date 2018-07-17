// @flow

import { Component } from 'react';
import AddIcon from '@atlaskit/icon/glyph/add';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { viewReducerUtils, withNavigationViews } from '../../src';

const { appendChildren, findId } = viewReducerUtils;

class Shortcuts extends Component<{ navigationViews: any }, { items: any[] }> {
  state = {
    items: [],
  };

  separatorItem = {
    id: 'shortcuts-separator',
    type: 'Separator',
  };

  addItem = {
    before: AddIcon,
    id: 'shortcuts-add-item',
    onClick: () => this.onAddItemClick(),
    text: 'Add shortcut',
    type: 'Item',
  };

  componentDidMount() {
    this.registerReducer();
  }

  componentWillUnmount() {
    this.unregisterReducer();
  }

  registerReducer() {
    const { navigationViews } = this.props;
    navigationViews.addReducer(
      'container/project/index',
      this.reducer,
      'shortcuts',
    );
  }

  unregisterReducer() {
    const { navigationViews } = this.props;
    navigationViews.removeReducer('container/project/index', this.reducer);
  }

  onAddItemClick = () => {
    const { items } = this.state;
    const i = items.length + 1;
    const newItem = {
      before: ShortcutIcon,
      id: `shortcut-item-${i}`,
      text: `Shortcut item ${i}`,
      type: 'Item',
    };

    this.setState({ items: [...items, newItem] }, () => {
      this.unregisterReducer();
      this.registerReducer();
    });
  };

  reducer = view => {
    const { items } = this.state;
    return findId('container/project/index:menu')(
      appendChildren([this.separatorItem, ...items, this.addItem]),
    )(view);
  };

  render() {
    return null;
  }
}

export default withNavigationViews(Shortcuts);
