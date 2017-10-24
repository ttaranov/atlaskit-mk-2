// @flow

import { Children, Component } from 'react';
import { render } from 'react-dom';
import type { SingleChild } from '../types';

type Props = {
  children: SingleChild,
};

export default class Portal extends Component {
  props: Props // eslint-disable-line react/sort-comp
  portalElement = null
  componentDidMount() {
    const node = document.createElement('div');
    if (document.body) {
      document.body.appendChild(node);
      this.portalElement = node;

      this.componentDidUpdate();
    }
  }
  componentDidUpdate() {
    const { children } = this.props;
    render(
      Children.only(children),
      this.portalElement
    );
  }
  componentWillUnmount() {
    document.body.removeChild(this.portalElement);
  }
  render() {
    return null;
  }
}
