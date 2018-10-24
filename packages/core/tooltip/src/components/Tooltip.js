// @flow
/* eslint-disable react/require-default-props */

import React, {
  Children,
  Component,
  type Node,
  type Element,
  type ComponentType,
} from 'react';
import NodeResolver from 'react-node-resolver';
import flushable from 'flushable';

import Portal from '@atlaskit/portal';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { layers } from '@atlaskit/theme';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import type { CoordinatesType, PositionType, PositionTypeBase } from '../types';
import { Tooltip as StyledTooltip } from '../styled';
import Animation from './Animation';
import Position from './Position';

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
  /**
    Hide the tooltip when the click event is triggered. This should be
    used when tooltip should be hiden if `onClick` react synthetic event
    is triggered, which happens after `onMouseDown` event
  */
  hideTooltipOnClick?: boolean,
  /**
    Hide the tooltip when the mousedown event is triggered. This should be
    used when tooltip should be hiden if `onMouseDown` react synthetic event
    is triggered, which happens before `onClick` event
  */
  hideTooltipOnMouseDown?: boolean,
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
  isVisible: boolean,
  everBeenVisible: boolean,
};

let pendingHide;

const showTooltip = (fn: boolean => void, defaultDelay: number) => {
  const isHidePending = pendingHide && pendingHide.pending();
  if (isHidePending) {
    pendingHide.flush();
  }
  const pendingShow = flushable(
    () => fn(isHidePending),
    isHidePending ? 0 : defaultDelay,
  );
  return pendingShow.cancel;
};

const hideTooltip = (fn: boolean => void, defaultDelay: number) => {
  pendingHide = flushable(flushed => fn(flushed), defaultDelay);
  return pendingHide.cancel;
};

class Tooltip extends Component<Props, State> {
  static defaultProps = {
    component: StyledTooltip,
    delay: 300,
    mousePosition: 'bottom',
    position: 'bottom',
    tag: 'div',
  };

  wrapperRef: HTMLElement | null;
  targetRef: HTMLElement | null;
  mouseCoordinates: CoordinatesType | null = null;
  cancelPendingSetState = () => {}; // set in mouseover/mouseout handlers
  state = {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    everBeenVisible: false,
  };

  componentWillUnmount() {
    this.cancelPendingSetState();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const scrollOptions = { capture: true, passive: true };
    if (!prevState.isVisible && this.state.isVisible) {
      if (this.props.onShow) this.props.onShow();

      window.addEventListener('scroll', this.handleWindowScroll, scrollOptions);
    } else if (prevState.isVisible && !this.state.isVisible) {
      if (this.props.onHide) this.props.onHide();

      window.removeEventListener(
        'scroll',
        this.handleWindowScroll,
        scrollOptions,
      );
    }
  }

  handleWindowScroll = () => {
    if (this.state.isVisible) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseClick = () => {
    if (this.props.hideTooltipOnClick) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseDown = () => {
    if (this.props.hideTooltipOnMouseDown) {
      this.cancelPendingSetState();
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseOver = (e: SyntheticMouseEvent<>) => {
    if (e.target === this.wrapperRef) return;
    // In the case where a tooltip is newly rendered but immediately becomes hovered,
    // we need to set the coordinates in the mouseOver event.
    if (!this.mouseCoordinates)
      this.mouseCoordinates = {
        left: e.clientX,
        top: e.clientY,
      };
    this.cancelPendingSetState();
    if (Boolean(this.props.content) && !this.state.isVisible) {
      this.cancelPendingSetState = showTooltip(immediatelyShow => {
        this.setState({
          isVisible: true,
          everBeenVisible: true,
          immediatelyShow,
        });
      }, this.props.delay);
    }
  };

  handleMouseLeave = (e: SyntheticMouseEvent<>) => {
    if (e.target === this.wrapperRef) return;
    this.cancelPendingSetState();
    if (this.state.isVisible) {
      this.cancelPendingSetState = hideTooltip(immediatelyHide => {
        this.setState({ isVisible: false, immediatelyHide });
      }, this.props.delay);
    }
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

  render() {
    const {
      children,
      content,
      position,
      mousePosition,
      truncate,
      component: TooltipContainer,
      tag: TargetContainer,
    } = this.props;
    const {
      isVisible,
      everBeenVisible,
      immediatelyShow,
      immediatelyHide,
    } = this.state;
    return (
      <React.Fragment>
        <TargetContainer
          onClick={this.handleMouseClick}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseLeave}
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          ref={wrapperRef => {
            this.wrapperRef = wrapperRef;
          }}
        >
          <NodeResolver
            innerRef={targetRef => {
              this.targetRef = targetRef;
            }}
          >
            {Children.only(children)}
          </NodeResolver>
        </TargetContainer>
        {everBeenVisible && (
          <Animation
            immediatelyShow={immediatelyShow}
            immediatelyHide={immediatelyHide}
            in={isVisible}
          >
            {getAnimationStyles => (
              <Portal zIndex={layers.tooltip()}>
                <Position
                  key={position}
                  mouseCoordinates={this.mouseCoordinates}
                  mousePosition={mousePosition}
                  position={position}
                  target={this.targetRef}
                >
                  {(ref, placement, positionStyles) => (
                    <TooltipContainer
                      innerRef={ref}
                      style={{
                        ...positionStyles,
                        ...getAnimationStyles(placement),
                      }}
                      truncate={truncate}
                      data-placement={placement}
                    >
                      {content}
                    </TooltipContainer>
                  )}
                </Position>
              </Portal>
            )}
          </Animation>
        )}
      </React.Fragment>
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
