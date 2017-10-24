// @flow
/* eslint-disable react/require-default-props */

import React, { Component } from 'react';

import type { ElementType, PlacementType, PositionType, SingleChild } from '../types';
import { Tooltip as StyledTooltip } from '../styled';

import Portal from './Portal';
import TooltipMarshal from './Marshal';
import Transition from './Transition';
import { getPosition } from './utils';

type Props = {
  /** A single element, either Component or DOM node. */
  children: SingleChild,
  /** The content of the tooltip. */
  content: string,
  /** Function to be called when a mouse leaves the target. */
  onMouseOut?: (MouseEvent) => void,
  /** Function to be called when a mouse enters the target. */
  onMouseOver?: (MouseEvent) => void,
  /** Where the tooltip should appear relative to its target. */
  placement: PlacementType,
  /** React <16.X requires a wrapping element. */
  tag?: string,
};
type State = {
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  isVisible: bool,
  placement: PlacementType,
  position: PositionType,
};

// global tooltip marshall
const marshall = new TooltipMarshal();

function getInitialState(props) {
  return {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    placement: props.placement,
    position: null,
  };
}

type showHideArgs = {
  immediate: boolean,
};

/* eslint-disable react/sort-comp */
export default class Tooltip extends Component {
  props: Props
  state: State = getInitialState(this.props)
  wrapper: ElementType
  static defaultProps = {
    placement: 'bottom',
    tag: 'div',
  }

  componentWillReceiveProps(nextProps: Props) {
    const { placement } = nextProps;

    // handle rare case where placement is changed while visible
    if (placement !== this.props.placement) {
      this.setState({ placement, position: null });
    }
  }

  handleWrapperRef = ref => {
    this.wrapper = ref;
  }

  handleMeasureRef = tooltip => {
    if (!tooltip) return;

    const { placement } = this.state;
    const target = this.wrapper.children.length
      ? this.wrapper.children[0]
      : this.wrapper;

    // NOTE: getPosition returns
    // placement Enum(top | left | bottom | right)
    //   - adjusted for edge collision
    // position: Object(left: number, top: number, position: 'fixed' | 'absolute')
    //   - coordinates passed to Transition
    this.setState(
      getPosition({ placement, target, tooltip })
    );
  }

  renderTooltip() {
    const { content } = this.props;
    const { immediatelyHide, immediatelyShow, isVisible, placement, position } = this.state;

    // bail immediately when not visible
    if (!isVisible) return null;

    // render node for measuring in alternate tree via portal
    if (!position) {
      return (
        <Portal>
          <StyledTooltip innerRef={this.handleMeasureRef} style={{ visibility: 'hidden' }}>
            {content}
          </StyledTooltip>
        </Portal>
      );
    }

    // render and animate tooltip when position available
    const transitionProps = { immediatelyHide, immediatelyShow, placement, position };
    return (
      <Transition {...transitionProps}>
        {content}
      </Transition>
    );
  }

  show = ({ immediate }: showHideArgs) => {
    this.setState({ immediatelyShow: immediate, isVisible: true, position: null });
  }
  hide = ({ immediate }: showHideArgs) => {
    // Update state twice to allow for the updated immediate prop to pass through
    // to the Transition component before the tooltip is removed
    this.setState({ immediatelyHide: immediate }, () => {
      this.setState({ isVisible: false, position: null });
    });
  }

  handleMouseOver = event => {
    const { onMouseOver } = this.props;

    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshall.show(this);

    if (onMouseOver) onMouseOver(event);
  }
  handleMouseOut = event => {
    const { onMouseOut } = this.props;

    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshall.hide(this);

    if (onMouseOut) onMouseOut(event);
  }

  render() {
    // NOTE: removing `placement` from spread props
    // eslint-disable-next-line no-unused-vars
    const { children, placement, tag: Tag, ...rest } = this.props;

    return (
      <Tag
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        ref={this.handleWrapperRef}
        {...rest}
      >
        {children}
        {this.renderTooltip()}
      </Tag>
    );
  }
}
