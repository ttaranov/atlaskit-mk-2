// @flow
/* eslint-disable react/require-default-props */

import React, { Children, Component, type Node } from 'react';

import type { PlacementType, PositionType, SingleChild } from '../types';
import {
  Tooltip as StyledTooltip,
  TruncatedTooltip as StyledTruncatedTooltip,
} from '../styled';

import Portal from './Portal';
import TooltipMarshal from './Marshal';
import Transition from './Transition';
import renamePropsWithWarning from './renamePropsWithWarning';
import { getPosition } from './utils';

type Props = {
  /** A single element, either Component or DOM node */
  children: SingleChild,
  /** The content of the tooltip */
  content: Node,
  /** Hide the tooltip when the element is clicked */
  hideTooltipOnClick?: boolean,
  /** Function to be called when a mouse leaves the target */
  onMouseOut?: MouseEvent => void,
  /** Function to be called when a mouse enters the target */
  onMouseOver?: MouseEvent => void,
  /** Where the tooltip should appear relative to its target */
  placement: PlacementType,
  /** React <16.X requires a wrapping element */
  tag: string,
  /** Show only one line of text, and truncate when too long */
  truncate?: boolean,
};
type State = {
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  isFlipped: boolean,
  isVisible: boolean,
  placement: PlacementType,
  position: PositionType | null,
};

// global tooltip marshall
const marshall = new TooltipMarshal();

function getInitialState(props): State {
  return {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    isFlipped: false,
    placement: props.placement,
    position: null,
  };
}

type showHideArgs = {
  immediate: boolean,
};

/* eslint-disable react/sort-comp */
class Tooltip extends Component<Props, State> {
  state = getInitialState(this.props);
  wrapper: HTMLElement | null;
  static defaultProps = {

    placement: 'bottom',
    tag: 'div',
  };

  componentWillReceiveProps(nextProps: Props) {
    const { placement, truncate } = nextProps;

    // handle case where placement is changed while visible
    if (placement !== this.props.placement) {
      this.setState({ placement, position: null });
    }

    // handle case where truncate is changed while visible
    if (truncate !== this.props.truncate) {
      this.setState({ position: null });
    }
  }

  handleWrapperRef = (ref: HTMLElement | null) => {
    this.wrapper = ref;
  };

  handleMeasureRef = (tooltip: HTMLElement) => {
    if (!tooltip || !this.wrapper) return;

    const { placement } = this.props;
    const target = this.wrapper.children.length
      ? this.wrapper.children[0]
      : this.wrapper;

    // NOTE getPosition returns:
    // placement Enum(top | left | bottom | right)
    //   - adjusted for edge collision
    // position: Object(left: number, top: number)
    //   - coordinates passed to Transition
    this.setState(getPosition({ placement, target, tooltip }));
  };

  renderTooltip() {
    const { content, truncate } = this.props;
    const {
      immediatelyHide,
      immediatelyShow,
      isVisible,
      placement,
      position,
    } = this.state;

    // bail immediately when not visible
    if (!isVisible) return null;

    // render node for measuring in alternate tree via portal
    if (!position) {
      const Measure = truncate ? StyledTruncatedTooltip : StyledTooltip;
      return (
        <Portal>
          <Measure
            innerRef={this.handleMeasureRef}
            style={{ visibility: 'hidden' }}
          >
            {content}
          </Measure>
        </Portal>
      );
    }

    // render and animate tooltip when position available
    const transitionProps = {
      immediatelyHide,
      immediatelyShow,
      placement,
      position,
      truncate,
    };
    return <Transition {...transitionProps}>{content}</Transition>;
  }

  show = ({ immediate }: showHideArgs) => {
    this.setState({
      immediatelyShow: immediate,
      isVisible: true,
      position: null,
    });
  };
  hide = ({ immediate }: showHideArgs) => {
    // Update state twice to allow for the updated `immediate` prop to pass through
    // to the Transition component before the tooltip is removed
    this.setState({ immediatelyHide: immediate }, () => {
      this.setState({ isVisible: false, position: null });
    });
  };

  handleMouseOver = (event: MouseEvent) => {
    const { onMouseOver } = this.props;

    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshall.show(this);

    if (onMouseOver) onMouseOver(event);
  };
  handleMouseOut = (event: MouseEvent) => {
    const { onMouseOut } = this.props;

    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshall.hide(this);

    if (onMouseOut) onMouseOut(event);
  };
  handleClick = () => {
    const { hideTooltipOnClick } = this.props;

    if (hideTooltipOnClick) this.hide({ immediate: true });
  };

  render() {
    // NOTE removing props from rest:
    // - `content` is a valid HTML attribute, but has a different semantic meaning
    // - `hideTooltipOnClick` is NOT valid and react will warn
    // - `placement` is NOT valid and react will warn
    // - `truncate` is NOT valid and react will warn
    // eslint-disable-next-line no-unused-vars
    const {
      children,
      content,
      hideTooltipOnClick,
      placement,
      truncate,
      tag: Tag,
      ...rest
    } = this.props;

    return (
      <Tag
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        ref={this.handleWrapperRef}
        {...rest}
      >
        {Children.only(children)}
        {this.renderTooltip()}
      </Tag>
    );
  }
}

export type TooltipType = Tooltip;

export default renamePropsWithWarning(Tooltip, {
  description: 'content',
  position: 'placement',
});
