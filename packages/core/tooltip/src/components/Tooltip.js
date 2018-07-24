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

import Portal from '@atlaskit/portal';
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
  isVisible: boolean,
  beenVisible: boolean,
};

const queueOperation = (defaultFn, delay, flushFn) => {
  let pending = true;
  const timeoutId = setTimeout(() => {
    pending = false;
    defaultFn();
  }, delay);
  return {
    flush: () => {
      if (pending) {
        clearTimeout(timeoutId);
        pending = false;
        flushFn();
      }
    },
    pending: () => pending,
    timeoutID: () => timeoutId,
  };
};

let pendingHide;

const showTooltip = (fn: boolean => void, defaultDelay: number) => {
  if (pendingHide && pendingHide.pending()) {
    pendingHide.flush();
    return setTimeout(() => fn(true), 0);
  }
  return setTimeout(() => fn(false), defaultDelay);
};

const hideTooltip = (fn: boolean => void, defaultDelay: number) => {
  pendingHide = queueOperation(() => fn(false), defaultDelay, () => fn(true));
  return pendingHide.timeoutID();
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
  timer: TimeoutID;
  state = {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    beenVisible: false,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.isVisible && this.state.isVisible) {
      window.addEventListener('scroll', this.handleWindowScroll);
    } else if (prevState.isVisible && !this.state.isVisible) {
      window.removeEventListener('scroll', this.handleWindowScroll);
    }
  }

  handleWindowScroll = () => {
    if (this.state.isVisible) {
      clearTimeout(this.timer);
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseClick = () => {
    if (this.props.hideTooltipOnClick) {
      clearTimeout(this.timer);
      this.setState({ isVisible: false, immediatelyHide: true });
    }
  };

  handleMouseOver = (e: SyntheticMouseEvent<>) => {
    if (e.target === this.wrapperRef) return;
    clearTimeout(this.timer);
    if (!this.state.isVisible) {
      this.timer = showTooltip(immediatelyShow => {
        this.setState({ isVisible: true, beenVisible: true, immediatelyShow });
        if (this.props.onShow) {
          this.props.onShow();
        }
      }, this.props.delay);
    }
  };

  handleMouseLeave = (e: SyntheticMouseEvent<>) => {
    if (e.target === this.wrapperRef) return;
    clearTimeout(this.timer);
    if (this.state.isVisible) {
      this.timer = hideTooltip(immediatelyHide => {
        this.setState({ isVisible: false, immediatelyHide });
        if (this.props.onHide) {
          this.props.onHide();
        }
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
      beenVisible,
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
        {beenVisible && (
          <Animation
            immediatelyShow={immediatelyShow}
            immediatelyHide={immediatelyHide}
            in={isVisible}
          >
            {animationStyles => (
              <Portal layer="tooltip">
                <Position
                  key={position}
                  mouseCoordinates={this.mouseCoordinates}
                  mousePosition={mousePosition}
                  position={position}
                  target={this.targetRef}
                >
                  {(ref, placement, style) => {
                    return (
                      <TooltipContainer
                        innerRef={ref}
                        style={{
                          ...style,
                          ...animationStyles,
                        }}
                        truncate={truncate}
                        data-placement={placement}
                      >
                        {content}
                      </TooltipContainer>
                    );
                  }}
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
