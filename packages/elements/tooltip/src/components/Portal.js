// @flow

import { Children, Component, type Element } from 'react';
import { render } from 'react-dom';

type Props = {
  children: Element<*>,
};

export default class Portal extends Component<Props> {
  props: Props; // eslint-disable-line react/sort-comp
  portalElement: HTMLElement;
  componentDidMount() {
    const body = document.body;
    if (body) {
      const node = document.createElement('div');
      body.appendChild(node);
      this.portalElement = node;

      this.componentDidUpdate();
    }
  }
  componentDidUpdate() {
    const { children } = this.props;
    render(Children.only(children), this.portalElement);
  }
  componentWillUnmount() {
    if (document.body) {
      document.body.removeChild(this.portalElement);
    }
  }
  render() {
    return null;
  }
}
