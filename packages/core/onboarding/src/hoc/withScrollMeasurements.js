// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, { Component, type ComponentType } from 'react';

import { type RegistryType } from '../components/SpotlightRegistry';

const SCROLLABLE = /auto|scroll/;

type Props = {
  spotlightRegistry: RegistryType,
  target?: string,
  targetNode?: HTMLElement,
};
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
    // $FlowFixMe - cannot call null on a number for document.documentElement
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

function cloneAndOverrideStyles(node: HTMLElement): HTMLElement {
  const shouldCloneChildren = true;
  const clonedNode = node.cloneNode(shouldCloneChildren);

  clonedNode.style.margin = '0';
  clonedNode.style.position = 'static';
  // The target may have other transforms applied. Avoid unintended side effects
  // by zeroing out "translate" rather than applying a value of "none".
  clonedNode.style.transform = 'translate(0, 0) translate3d(0, 0, 0)';

  return clonedNode;
}

export default function withScrollMeasurements(
  WrappedComponent: ComponentType<*>,
) {
  return class SpotlightMeasurer extends Component<Props, State> {
    state: State = { scrollY: 0 };
    componentWillMount() {
      const { spotlightRegistry } = this.props;
      const node = this.getNode();

      // let the registry know that there's a spotlight mounted so it can
      // render a blanket, lock scroll etc.
      spotlightRegistry.mount(node);

      // this feels hacky, might need to refactor
      this.setState({ scrollY: getScrollY(node) }, () => {
        this.measureAndScroll(node);
      });
    }
    componentWillUnmount() {
      const { spotlightRegistry } = this.props;
      const node = this.getNode();
      spotlightRegistry.unmount(node);
    }
    getNode = () => {
      const { spotlightRegistry, target, targetNode } = this.props;

      let node;
      if (targetNode) {
        node = targetNode;
      } else if (target) {
        node = spotlightRegistry.get(target);
      }

      // can't do anything without the node, bail
      if (!node) {
        throw new Error('You must provide a `target`, or `targetNode`.');
      }

      return node;
    };
    measureAndScroll = (node: HTMLElement) => {
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
        window.scrollBy(0, offsetY);
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

      // override styles that effect the position of our target node
      const clonedNode = cloneAndOverrideStyles(node);

      this.setState({
        clone: clonedNode.outerHTML,
        rect: { height, left, top, width },
        scrollY: getScrollY(),
      });
    };
    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
}
