// @flow
/* eslint-disable react/require-default-props */

import React, {
  Children,
  Component,
  type Node,
  type Element,
  type ComponentType,
} from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import NodeResolver from 'react-node-resolver';
import { TransitionGroup } from 'react-transition-group';

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
  mousePosition: PositionTypeBase,
};

function getInitialState(props): State {
  return {
    immediatelyHide: false,
    immediatelyShow: false,
    isVisible: false,
    mousePosition: props.mousePosition,
  };
}

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
  state = getInitialState(this.props);
  wrapperRef: HTMLElement | null;
  mouseCoordinates: CoordinatesType | null = null;
  timer: TimeoutID;
  static defaultProps = {
    component: StyledTooltip,
    delay: 300,
    mousePosition: 'bottom',
    position: 'bottom',
    tag: 'div',
  };

  handleMouseOver = (e: SyntheticMouseEvent<>) => {
    if (e.target === this.wrapperRef) return;
    clearTimeout(this.timer);
    if (!this.state.isVisible) {
      this.timer = showTooltip(immediatelyShow => {
        this.setState({ isVisible: true, immediatelyShow });
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

  render() {
    const {
      children,
      content,
      position,
      truncate,
      component: TooltipContainer,
      tag: TargetContainer,
    } = this.props;
    const { isVisible, immediatelyShow, immediatelyHide } = this.state;
    return (
      <Manager>
        <TargetContainer
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseLeave}
          ref={wrapperRef => {
            this.wrapperRef = wrapperRef;
          }}
        >
          <Reference>
            {({ ref }) => (
              <NodeResolver innerRef={ref}>
                {Children.only(children)}
              </NodeResolver>
            )}
          </Reference>
        </TargetContainer>
        <TransitionGroup>
          {isVisible && (
            <Animation
              immediatelyShow={immediatelyShow}
              immediatelyHide={immediatelyHide}
            >
              {animationStyles => (
                <Portal layer="tooltip">
                  <Popper placement={position}>
                    {({ placement, ref, style }) => (
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
                    )}
                  </Popper>
                </Portal>
              )}
            </Animation>
          )}
        </TransitionGroup>
      </Manager>
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
