// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { type ComponentType } from '../types';

import SpotlightRegistry from '../components/SpotlightRegistry';

type Props = { target: string };
type State = {
  clone?: string, // string representation of HTMLElement
  scrollY: number,
  rect?: {},
};

function elementCropDirection(el: HTMLElement) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();

  let direction;

  if (rect.top <= 0) {
    direction = 'top';
  }
  if (
    // $FlowFixMe
    rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)
  ) {
    direction = 'bottom';
  }

  return direction;
}
function getScrollY() {
  return (
    window.pageYOffset ||
    // $FlowFixMe
    document.documentElement.scrollTop ||
    // $FlowFixMe
    document.body.scrollTop ||
    0
  );
}

export default function withScrollMeasurements(
  WrappedComponent: ComponentType,
) {
  return class SpotlightWrapper extends Component<Props, State> {
    state: State = { scrollY: getScrollY() };
    static contextTypes = {
      spotlightRegistry: PropTypes.instanceOf(SpotlightRegistry).isRequired,
    };
    componentWillMount() {
      const { target } = this.props;
      const { spotlightRegistry } = this.context;

      if (!spotlightRegistry) {
        throw Error('`Spotlight` requires `SpotlightManager` as an ancestor.');
      }
      spotlightRegistry.mount(target);
      const node = spotlightRegistry.get(target);
      this.measureAndScroll(node);
    }
    componentWillUnmount() {
      const { target } = this.props;
      const { spotlightRegistry } = this.context;

      spotlightRegistry.unmount(target);
    }
    measureAndScroll = (node: HTMLElement) => {
      if (!node) {
        throw new Error(`
          It looks like you're trying to render a spotlight dialog without a
          target, or before the target has rendered.
        `);
      }
      const {
        height,
        left,
        top: initialTop,
        width,
      } = node.getBoundingClientRect();
      const { scrollY } = this.state;
      const gutter = 10; // enough room to be comfortable and not crop the pulse animation
      let top = initialTop;
      const cropDirection = elementCropDirection(node);

      // scroll if necessary
      if (cropDirection === 'top') {
        const offsetY = scrollY + (initialTop - gutter);
        top = gutter;
        window.scrollTo(0, offsetY);
      } else if (cropDirection === 'bottom') {
        const offsetY = initialTop - window.innerHeight + height + gutter;
        top = initialTop - offsetY;
        window.scrollTo(0, scrollY + offsetY);
      }

      // get adjusted measurements after scrolling
      this.setState({
        clone: node.outerHTML,
        rect: { height, left, top, width },
        scrollY: getScrollY(),
      });
    };
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
}
