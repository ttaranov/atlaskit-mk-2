// @flow
/* eslint-disable react/require-default-props */

import React, {
  Children,
  Component,
  type Node,
  type Element,
  type ComponentType,
} from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import type { CoordinatesType, PositionType, PositionTypeBase } from '../types';
import { Tooltip as StyledTooltip } from '../styled';

import Portal from './Portal';
import TooltipMarshal from './Marshal';
import Transition from './Transition';
import { getPosition } from './utils';
import { hoveredPayload, unhoveredPayload } from './utils/analytics-payloads';

type Props = {
  /** A single element, either Component or DOM node */
  children: Element<*>,
  /** The content of the tooltip */
  content: Node,
  /** Extend `TooltipPrimitive` to create your own tooptip and pass it as component */
  component: ComponentType<{ innerRef: HTMLElement => void }>,
  /** Time in milliseconds to wait before showing and hiding the tooltip. Defaults to 300. */
  delay: number,
  /** Hide the tooltip when the element is clicked */
  hideTooltipOnClick?: boolean,
  /**
    Where the tooltip should appear relative to the mouse. Only used when the
    `position` prop is set to 'mouse'
  */
  mousePosition: PositionTypeBase,
  /**
    Function to be called when the tooltip will be shown. It is called when the
    tooltip begins to animate in.
  */
  onShow?: () => void,
  /**
    Function to be called when the tooltip will be hidden. It is called after the
    delay, when the tooltip begins to animate out.
  */
  onHide?: () => void,
  /**
    Where the tooltip should appear relative to its target. If set to 'mouse',
    tooltip will display next to the mouse instead.
  */
  position: PositionType,
  /**
    Replace the wrapping element. This accepts the name of a html tag which will
    be used to wrap the element.
  */
  tag: string,
  /** Show only one line of text, and truncate when too long */
  truncate?: boolean,
};

type State = {
  immediatelyHide: boolean,
  immediatelyShow: boolean,
  isFlipped: boolean,
  isVisible: boolean,
  /** This is used for the slide transition of tooltips. */
  position: PositionType,
  mousePosition: PositionTypeBase,
  coordinates: CoordinatesType | null,
};

// global tooltip marshal
// export for testing purposes
export const marshal = new TooltipMarshal();

function getInitialState(props): State {
  return {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    isFlipped: false,
    position: props.position,
    mousePosition: props.mousePosition,
    coordinates: null,
  };
}

class Tooltip extends Component<Props, State> {
  state = getInitialState(this.props);
  wrapper: HTMLElement | null;
  mouseCoordinates: CoordinatesType | null = null;
  static defaultProps = {
    component: StyledTooltip,
    delay: 300,
    mousePosition: 'bottom',
    position: 'bottom',
    tag: 'div',
  };

  componentWillReceiveProps(nextProps: Props) {
    const { position, truncate, mousePosition } = nextProps;

    // handle case where position is changed while visible
    if (
      position !== this.props.position ||
      mousePosition !== this.props.mousePosition
    ) {
      this.setState({ position, mousePosition, coordinates: null });
    }

    // handle case where truncate is changed while visible
    if (truncate !== this.props.truncate) {
      this.setState({ coordinates: null });
    }
  }

  componentWillUnmount() {
    marshal.unmount(this);
  }

  handleWrapperRef = (ref: HTMLElement | null) => {
    this.wrapper = ref;
  };

  handleMeasureRef = (tooltip: HTMLElement) => {
    if (!tooltip || !this.wrapper) return;

    const { position, mousePosition } = this.props;
    const { mouseCoordinates } = this;
    const target = this.wrapper.children.length
      ? this.wrapper.children[0]
      : this.wrapper;

    const positionData = getPosition({
      position,
      target,
      tooltip,
      mouseCoordinates,
      mousePosition,
    });
    this.setState(positionData);
  };

  renderTooltip() {
    const { content, truncate, component } = this.props;
    const {
      immediatelyHide,
      immediatelyShow,
      isVisible,
      mousePosition,
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
      mousePosition,
      position,
      coordinates,
      truncate,
    };

    return <Transition {...transitionProps}>{content}</Transition>;
  }

  show = ({ immediate }: { immediate: boolean }) => {
    const { onShow } = this.props;
    this.setState({
      immediatelyShow: immediate,
      isVisible: true,
      coordinates: null,
    });
    if (onShow) onShow();
  };
  // eslint-disable-next-line react/no-unused-prop-types
  hide = ({ immediate }: { immediate: boolean }) => {
    const { onHide } = this.props;
    // Update state twice to allow for the updated `immediate` prop to pass through
    // to the Transition component before the tooltip is removed
    this.setState({ immediatelyHide: immediate }, () => {
      this.setState({ isVisible: false, coordinates: null });
    });
    if (onHide) onHide();
  };

  handleMouseOver = (event: MouseEvent) => {
    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshal.show(this);
  };
  handleMouseOut = (event: MouseEvent) => {
    // bail if over the wrapper, we only want to target the first child.
    if (event.target === this.wrapper) return;

    marshal.hide(this);
  };

  // Update mouse coordinates, used when position is 'mouse'.
  // We are not debouncing/throttling this function because we aren't causing any
  // re-renders or performaing any intensive calculations, we're just updating a value.
  // React also doesn't play nice debounced DOM event handlers because they pool their
  // SyntheticEvent objects. Need to use event.persist as a workaround - https://stackoverflow.com/a/24679479/893630
  handleMouseMove = (event: MouseEvent) => {
    this.mouseCoordinates = {
      left: event.clientX,
      top: event.clientY,
    };
  };

  handleClick = () => {
    const { hideTooltipOnClick } = this.props;

    if (hideTooltipOnClick) this.hide({ immediate: true });
  };

  render() {
    const { children, tag: Tag } = this.props;

    return (
      <Tag
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        ref={this.handleWrapperRef}
      >
        {Children.only(children)}
        {this.renderTooltip()}
      </Tag>
    );
  }
}

export { Tooltip as TooltipWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export type TooltipType = Tooltip;

export default withAnalyticsContext({
  componentName: 'tooltip',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onHide: unhoveredPayload,
    onShow: createAndFireEventOnAtlaskit({ ...hoveredPayload }),
  })(Tooltip),
);
