// @flow
import React, {
  Component,
  type Component as ComponentType,
  type Element as ReactElement,
} from 'react';
import { findDOMNode } from 'react-dom';
import Spinner from '@atlaskit/spinner';
import type { SpinnerSizeType } from '../types';

import { LARGE, LOADING_CONTENTS_OPACITY } from '../internal/constants';
import {
  Container,
  SpinnerBackdrop,
  SpinnerContainer,
} from '../styled/LoadingContainerAdvanced';

type Props = {
  children: ReactElement<any>,
  isLoading?: boolean,
  spinnerSize?: SpinnerSizeType,
  contentsOpacity: number,
  targetRef?: Function, // eslint-disable-line react/no-unused-prop-types
};

export default class LoadingContainerAdvanced extends Component<Props, {}> {
  children: Element | null;
  spinner: ComponentType<any> | void | null;
  static defaultProps = {
    isLoading: true,
    spinnerSize: LARGE,
    contentsOpacity: LOADING_CONTENTS_OPACITY,
  };

  componentDidMount = () => {
    if (this.props.isLoading && this.hasTargetNode()) {
      this.attachListeners();
      this.updateTargetAppearance();
      this.updateSpinnerPosition();
    }
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (!nextProps.isLoading || !this.hasTargetNode(nextProps)) {
      this.detachListeners();
    } else if (!this.props.isLoading) {
      this.attachListeners();
    }
  };

  componentDidUpdate = () => {
    if (this.hasTargetNode()) {
      this.updateTargetAppearance();

      if (this.props.isLoading) {
        this.updateSpinnerPosition();
      }
    }
  };

  componentWillUnmount = () => {
    this.detachListeners();
  };

  getTargetNode = (nextProps: Props = this.props): Element | Text | null => {
    const { targetRef } = nextProps;

    // targetRef prop may be defined but it is not guaranteed it returns an element
    const targetElement = targetRef ? targetRef() : this.children;
    const targetNode = findDOMNode(targetElement); // eslint-disable-line react/no-find-dom-node

    return targetNode;
  };

  getThisNode = () => findDOMNode(this); // eslint-disable-line react/no-find-dom-node

  getSpinnerNode = () => findDOMNode(this.spinner); // eslint-disable-line react/no-find-dom-node

  hasTargetNode = (nextProps?: Props) => !!this.getTargetNode(nextProps);

  isVerticallyVisible = (
    elementRect: { top: number, bottom: number },
    viewportHeight: number,
  ) => {
    const { top, bottom } = elementRect;
    if (bottom <= 0) {
      return false;
    }
    return top < viewportHeight;
  };

  isFullyVerticallyVisible = (
    elementRect: { top: number, bottom: number },
    viewportHeight: number,
  ) => {
    const { top, bottom } = elementRect;
    return top >= 0 && bottom <= viewportHeight;
  };

  attachListeners() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  detachListeners() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.updateSpinnerPosition();
  };

  handleScroll = () => {
    this.updateSpinnerPosition();
  };

  translateSpinner = (
    spinnerNode: Element | Text | null,
    transformY: number,
    isFixed?: boolean,
  ) => {
    // $FlowFixMe - style is not Element
    spinnerNode.style.position = isFixed ? 'fixed' : ''; // eslint-disable-line no-param-reassign
    // $FlowFixMe - style is not Element
    spinnerNode.style.transform = // eslint-disable-line no-param-reassign
      transformY !== 0 ? `translate3d(0, ${transformY}px, 0)` : '';
  };

  updateTargetAppearance = () => {
    const targetNode = this.getTargetNode();
    const { isLoading, contentsOpacity } = this.props;
    if (
      targetNode &&
      // $FlowFixMe - style is not Element
      targetNode.style &&
      typeof targetNode.style === 'object'
    ) {
      targetNode.style.pointerEvents = isLoading ? 'none' : ''; // eslint-disable-line no-param-reassign
      targetNode.style.opacity = isLoading ? contentsOpacity : ''; // eslint-disable-line no-param-reassign
    }
  };

  updateSpinnerPosition() {
    const viewportHeight = window.innerHeight;
    const targetNode = this.getTargetNode();
    const spinnerNode = this.getSpinnerNode();

    if (!targetNode || !spinnerNode) return;
    // $FlowFixMe - getBoundingClientRect() is not found
    const targetRect = targetNode.getBoundingClientRect();
    // $FlowFixMe - getBoundingClientRect() is not found
    const spinnerRect = spinnerNode.getBoundingClientRect();
    const spinnerHeight = spinnerRect.height;
    const isInViewport = this.isVerticallyVisible(targetRect, viewportHeight);
    const { top, bottom, height } = targetRect;

    if (isInViewport) {
      // The spinner may follow the element only if there is enough space:
      // Let's say the element can fit at least three spinners (vertically)
      const canFollow = height >= spinnerHeight * 3;
      if (
        canFollow &&
        !this.isFullyVerticallyVisible(targetRect, viewportHeight)
      ) {
        if (top >= 0) {
          // Only the head of the element is visible
          const viewportSpaceTakenByElement = viewportHeight - top;
          const diff =
            viewportSpaceTakenByElement / 2 + top - spinnerHeight / 2;
          const y =
            viewportSpaceTakenByElement < spinnerHeight * 3
              ? top + spinnerHeight
              : diff;
          this.translateSpinner(spinnerNode, y, true);
        } else if (top < 0 && bottom > viewportHeight) {
          // The element takes all viewport, nor its head nor tail are visible
          const y = viewportHeight / 2 - spinnerHeight / 2;
          this.translateSpinner(spinnerNode, y, true);
        } else {
          // Only the tail of the element is visible
          const diff = bottom / 2 - spinnerHeight / 2;
          const y = diff < spinnerHeight ? diff - (spinnerHeight - diff) : diff;
          this.translateSpinner(spinnerNode, y, true);
        }
        return;
      }
    } else {
      // If both the element and the spinner are off screen - quit
      // eslint-disable-next-line no-lonely-if
      if (!this.isVerticallyVisible(spinnerRect, viewportHeight)) {
        return;
      }
    }

    // Three options here:
    // 1) the element is fully visible
    // 2) the element is too small for the spinner to follow
    // 3) the spinner might still be visible while the element isn't
    const thisNode = this.getThisNode();
    if (thisNode && typeof thisNode.getBoundingClientRect === 'function') {
      const thisTop = thisNode.getBoundingClientRect().top;
      const y = (top - thisTop) / 2;
      this.translateSpinner(spinnerNode, y, false);
    }
  }

  render() {
    const { children, isLoading, spinnerSize } = this.props;

    return (
      <Container>
        {React.cloneElement(children, {
          ref: el => {
            this.children = el;
          },
        })}
        {isLoading && (
          <SpinnerBackdrop>
            <SpinnerContainer
              ref={el => {
                this.spinner = el;
              }}
            >
              <Spinner size={spinnerSize} />
            </SpinnerContainer>
          </SpinnerBackdrop>
        )}
      </Container>
    );
  }
}
