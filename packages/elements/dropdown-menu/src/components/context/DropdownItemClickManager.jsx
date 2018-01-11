// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';
import { clickManagerContext } from '../../util/contextNamespace';
import type { ReactElement } from '../../../src/types';

type Props = {
  children?: ReactElement,
  onItemClicked: (event: MouseEvent | KeyboardEvent) => void,
};

export default class DropdownItemClickManager extends Component {
  props: Props // eslint-disable-line react/sort-comp

  static childContextTypes = {
    [clickManagerContext]: PropTypes.object,
  };

  getChildContext() {
    return {
      [clickManagerContext]: {
        itemClicked: this.handleItemClicked,
      },
    };
  }

  handleItemClicked = (event: MouseEvent | KeyboardEvent) => {
    this.props.onItemClicked(event);
  }

  render() {
    return this.props.children;
  }
}
