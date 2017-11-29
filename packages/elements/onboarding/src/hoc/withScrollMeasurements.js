// @flow
/* eslint-disable react/sort-comp, react/no-multi-comp */
import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';

import SpotlightRegistry from '../components/SpotlightRegistry';

type Props = {|
  target: HTMLElement,
|};
type State = {|
  scrollY: number,
|};

function elementCropDirection(el) {
  const rect = el.getBoundingClientRect();

  let direction;

  if (rect.top <= 0) {
    direction = 'top';
  }
  if (
    rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)
  ) {
    direction = 'bottom';
  }

  return direction;
}
function getScrollY() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}
function getInitialState() {
  return {
    scrollY: getScrollY(),
  };
}

export default function withScrollMeasurements(WrappedComponent) {
  return class SpotlightWrapper extends Component {
    props: Props;
    state: State = getInitialState();
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
    measureAndScroll = (node: Node) => {
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
      return (
        <WrappedComponent {...this.context} {...this.props} {...this.state} />
      );
    }
  };
}
