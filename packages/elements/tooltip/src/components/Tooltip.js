// @flow
/* eslint-disable react/require-default-props */

import React, {
  Children,
  Component,
  type Node,
  type Element,
  type ComponentType,
} from 'react';
import renamePropsWithWarning from 'react-deprecate';

import type { CoordinatesType, PositionType } from '../types';
import { Tooltip as StyledTooltip } from '../styled';

import Portal from './Portal';
import TooltipMarshal from './Marshal';
import Transition from './Transition';
import { getPosition } from './utils';

type Props = {
  /** A single element, either Component or DOM node */
  children: Element<*>,
  /** The content of the tooltip */
  content: Node,
  /** Extend `TooltipPrimitive` to create you own tooptip and pass it as component */
  component: ComponentType<{ innerRef: HTMLElement => void }>,
  /** Hide the tooltip when the element is clicked */
  hideTooltipOnClick?: boolean,
  /** Function to be called when a mouse leaves the target */
  onMouseOut?: MouseEvent => void,
  /** Function to be called when a mouse enters the target */
  onMouseOver?: MouseEvent => void,
  /** Where the tooltip should appear relative to its target */
  position: PositionType,
  /** Replace the wrapping element */
  tag: string,
  /** Show only one line of text, and truncate when too long */
  truncate?: boolean,
};
type State = {
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  isFlipped: boolean,
  isVisible: boolean,
  position: PositionType,
  coordinates: CoordinatesType | null,
};

// global tooltip marshall
const marshall = new TooltipMarshal();

function getInitialState(props): State {
  return {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    isFlipped: false,
    position: props.position,
    coordinates: null,
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
    component: StyledTooltip,
    position: 'bottom',
    tag: 'div',
  };

  componentWillReceiveProps(nextProps: Props) {
    const { position, truncate } = nextProps;

    // handle case where position is changed while visible
    if (position !== this.props.position) {
      this.setState({ position, coordinates: null });
    }

    // handle case where truncate is changed while visible
    if (truncate !== this.props.truncate) {
      this.setState({ coordinates: null });
    }
  }

  handleWrapperRef = (ref: HTMLElement | null) => {
    this.wrapper = ref;
  };

  handleMeasureRef = (tooltip: HTMLElement) => {
    if (!tooltip || !this.wrapper) return;

    const { position } = this.props;
    const target = this.wrapper.children.length
      ? this.wrapper.children[0]
      : this.wrapper;

    // NOTE getPosition returns:
    // position Enum(top | left | bottom | right)
    //   - adjusted for edge collision
    // coordinates: Object(left: number, top: number)
    //   - coordinates passed to Transition
    this.setState(getPosition({ position, target, tooltip }));
  };

  renderTooltip() {
    const { content, truncate, component } = this.props;
    const {
      immediatelyHide,
      immediatelyShow,
      isVisible,
      position,
      coordinates,
    } = this.state;

    // bail immediately when not visible, or when there is no content
    if (!isVisible || !content) return null;

    // render node for measuring in alternate tree via portal
    if (!coordinates) {
      const MeasurableTooltip = component;
      return (
        <Portal>
          <MeasurableTooltip
            innerRef={this.handleMeasureRef}
            style={{ visibility: 'hidden' }}
          >
            {content}
          </MeasurableTooltip>
        </Portal>
      );
    }

    // render and animate tooltip when coordinates available
    const transitionProps = {
      component,
      immediatelyHide,
      immediatelyShow,
      position,
      coordinates,
      truncate,
    };
    return <Transition {...transitionProps}>{content}</Transition>;
  }

  show = ({ immediate }: showHideArgs) => {
    this.setState({
      immediatelyShow: immediate,
      isVisible: true,
      coordinates: null,
    });
  };
  hide = ({ immediate }: showHideArgs) => {
    // Update state twice to allow for the updated `immediate` prop to pass through
    // to the Transition component before the tooltip is removed
    this.setState({ immediatelyHide: immediate }, () => {
      this.setState({ isVisible: false, coordinates: null });
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
    // - `component` is NOT valid and react will warn
    // - `hideTooltipOnClick` is NOT valid and react will warn
    // - `position` is NOT valid and react will warn
    // - `truncate` is NOT valid and react will warn
    // eslint-disable-next-line no-unused-vars
    const {
      children,
      component,
      content,
      hideTooltipOnClick,
      position,
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
});
