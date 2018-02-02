// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { type ComponentType } from '../types';

import SpotlightRegistry from '../components/SpotlightRegistry';

const SCROLLABLE = /auto|scroll/;

type Props = { target: string };
type State = {
  clone?: string, // string representation of HTMLElement
  scrollY: number,
  rect?: {},
};

function computedStyle(node, prop) {
  if (!node) return '';
  return prop
    ? window.getComputedStyle(node, null)[prop]
    : window.getComputedStyle(node, null);
}

function getScrollParent(node: any) {
  if (node == null) return null;
  if (
    node.scrollHeight > node.clientHeight &&
    (SCROLLABLE.test(computedStyle(node, 'overflow')) ||
      SCROLLABLE.test(computedStyle(node, 'overflowY')))
  ) {
    return node;
  }
  return getScrollParent(node.parentNode);
}

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

function getScrollY(node = window) {
  if (node === window) {
    return window.pageYOffset;
  }
  const scrollContainer = getScrollParent(node);

  return scrollContainer ? scrollContainer.scrollTop : window.pageYOffset;
}

export default function withScrollMeasurements(
  WrappedComponent: ComponentType,
) {
  return class SpotlightWrapper extends Component<Props, State> {
    state: State = { scrollY: 0 };
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
      this.setState({ scrollY: getScrollY(node) }, () => {
        this.measureAndScroll(node);
      });
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

      const gutter = 10; // enough room to be comfortable and not crop the pulse animation

      let top = initialTop;
      let offsetY;

      const cropDirection = elementCropDirection(node);
      const scrollParent = getScrollParent(node) || window;
      if (scrollParent === window) {
        if (cropDirection === 'top') {
          offsetY = initialTop - gutter;
          top = gutter;
        } else if (cropDirection === 'bottom') {
          offsetY = initialTop - window.innerHeight + height + gutter;
          top = window.innerHeight - (height + gutter);
        }
        scrollParent.scrollBy(0, offsetY);
      } else {
        const {
          height: parentHeight,
          top: parentTop,
        } = scrollParent.getBoundingClientRect();
        if (cropDirection === 'top') {
          // We're using Math.abs here because we need to add
          // the absolute values of initial top and parent top together
          // for the specific offsetY value.
          offsetY = -(Math.abs(initialTop) + Math.abs(parentTop) + gutter);
          top = parentTop + gutter;
        } else if (cropDirection === 'bottom') {
          offsetY = initialTop + height - (parentTop + parentHeight) + gutter;
          top = parentHeight + parentTop - gutter - height;
        }
        scrollParent.scrollTop += offsetY;
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
