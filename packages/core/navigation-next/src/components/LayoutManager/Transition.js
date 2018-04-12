// @flow

import React, { Component, type ElementRef } from 'react';
import { css } from 'emotion';

const camelToKebab = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

type Props = {
  children: ({ [string]: any }) => any,
  jss?: Object,
  isEnabled?: boolean,
  keys: Array<string>,
  values: Array<number | string>,
};
type State = { isTransitioning: boolean };

function getCSS(keys, styles) {
  return {
    transition: keys
      .map(k => `${camelToKebab(k)} 300ms cubic-bezier(0.2, 0, 0, 1)`)
      .join(','),
    ...styles,
  };
}
function getStyle({ keys, values }) {
  const style = {};
  keys.forEach((k, i) => {
    style[k] = values[i];
  });
  return style;
}

export default class Transition extends Component<Props, State> {
  static defaultProps = {
    isEnabled: true,
  };
  target: HTMLElement;
  observer: MutationObserver;
  state = { isTransitioning: false };

  // there's no standard `transitionStart` event, so we need this weirdness
  componentDidMount() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(this.watch);
    });
    this.observer.observe(this.target, { attributes: true });
  }
  componentWillUnmount() {
    this.observer.disconnect();
  }

  watch = ({ attributeName }: MutationRecord) => {
    const { isEnabled } = this.props;
    const { isTransitioning } = this.state;

    if (attributeName === 'style' && !isTransitioning && isEnabled) {
      this.setState({ isTransitioning: true });
    }
  };
  handleTransitionEnd = () => {
    this.setState({ isTransitioning: false });
  };
  getTarget = (ref: ElementRef<*>) => {
    this.target = ref;
  };

  render() {
    const { jss, isEnabled, keys, values } = this.props;
    const { isTransitioning } = this.state;
    const className = isEnabled ? css(getCSS(keys, jss)) : css(jss);

    return (
      <div
        className={className}
        onTransitionEnd={this.handleTransitionEnd}
        ref={this.getTarget}
        style={getStyle({ keys, values })}
      >
        {this.props.children({ isTransitioning })}
      </div>
    );
  }
}
