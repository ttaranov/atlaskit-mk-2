// @flow
import React, { PureComponent, type ElementRef } from 'react';
import { withTheme } from 'styled-components';
import rafSchedule from 'raf-schd';
import {
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import ResizerInner from '../styled/ResizerInner';
import ResizerButton from './ResizerButton';
import {
  globalOpenWidth,
  standardOpenWidth,
  resizerClickableWidth,
} from '../../shared-variables';
import { isElectronMac } from '../../theme/util';

type Props = {
  onResizeStart: () => {},
  onResizeEnd: (resizeDelta: number, UIAnalyticsEvent) => void,
  onResizeButton: (
    { isOpen: boolean, width: number },
    UIAnalyticsEvent,
  ) => void,
  onResize: (resizeDelta: number) => void,
  navigationWidth: number,
  showResizeButton: boolean,
  theme: {},
};

type State = {
  startScreenX: number,
  isHovering: boolean,
  isResizing: boolean,
};

class Resizer extends PureComponent<Props & WithAnalyticsEventsProps, State> {
  static defaultProps = {
    onResizeStart: () => {},
    onResizeEnd: () => {},
    onResizeButton: () => {},
    onResize: () => {},
    navigationWidth: standardOpenWidth(false),
    showResizeButton: true,
    theme: {},
  };
  state = {
    startScreenX: 0,
    isHovering: false,
    isResizing: false,
  };

  scheduleResize = rafSchedule(delta => {
    if (this.state.isResizing && delta) {
      this.props.onResize(delta);
    }
  });

  resizerNode: ElementRef<*>;

  mouseDownHandler = e => {
    e.preventDefault();
    if (!this.resizerNode || e.target !== this.resizerNode) {
      return;
    }

    if (this.state.isResizing) {
      // eslint-disable-next-line no-console
      console.error('attempting to start a resize when another is occurring');
      return;
    }

    this.setState({
      isResizing: true,
      startScreenX: e.screenX,
    });
    this.props.onResizeStart();
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);
    window.addEventListener('mouseout', this.handleOutofBounds);
  };

  mouseUpHandler = (e, outOfBounds = false) => {
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);
    window.removeEventListener('mouseout', this.handleOutofBounds);

    const analyticsEvent = this.props.createAnalyticsEvent({
      action: 'drag',
    });

    this.setState({
      isResizing: false,
    });

    const screenX = outOfBounds
      ? // If we have gone out of bounds, reduce the nav width so the resizer is still visible
        e.screenX - 2 * resizerClickableWidth
      : e.screenX;

    const delta = screenX - this.state.startScreenX;

    if (delta === 0) {
      const barClickEvent = analyticsEvent.clone().update({ action: 'click' });
      this.resizeButtonHandler(e, barClickEvent);
    }

    // Perform one final resize before ending
    this.props.onResize(delta);

    this.props.onResizeEnd(delta, analyticsEvent);
  };

  mouseMoveHandler = e => {
    this.scheduleResize(e.screenX - this.state.startScreenX);
  };

  mouseEnterHandler = () => {
    this.setState({
      isHovering: true,
    });
  };

  mouseLeaveHandler = () => {
    this.setState({
      isHovering: false,
    });
  };

  // Handle when mouse moves over an element that won't fire mouse events.
  // Fires a mouseup immediately to prevent mouseup not being fired at all.
  handleOutofBounds = e => {
    const toEl = e.relatedTarget;
    const disableResizeNodes = [
      'IFRAME', // Moving into an iframe
      'HTML', // Moving out of an iframe or root window - Safari
      null, // Moving out of an iframe or root window - Other browsers
    ];

    if (
      this.state.isResizing &&
      disableResizeNodes.includes(toEl && toEl.nodeName)
    ) {
      this.mouseUpHandler(e, true);
    }
  };

  isElectronMac = () => isElectronMac(this.props.theme);

  isPointingRight = () =>
    this.props.navigationWidth < standardOpenWidth(this.isElectronMac());

  resizeButtonHandler = (e: Event, analyticsEvent: UIAnalyticsEvent) => {
    const isElectron = this.isElectronMac();
    const { navigationWidth, onResizeButton } = this.props;
    const standardOpenWidthResult = standardOpenWidth(isElectron);
    const isExpanded = navigationWidth > standardOpenWidthResult;
    const isPointingRight = this.isPointingRight();

    if (isPointingRight || isExpanded) {
      onResizeButton(
        {
          isOpen: true,
          width: standardOpenWidthResult,
        },
        analyticsEvent,
      );
    } else {
      onResizeButton(
        {
          isOpen: false,
          width: globalOpenWidth(isElectron),
        },
        analyticsEvent,
      );
    }
  };

  render() {
    const resizerButton = this.props.showResizeButton ? (
      <ResizerButton
        isVisible={this.state.isHovering}
        isPointingRight={this.isPointingRight()}
        onClick={this.resizeButtonHandler}
      />
    ) : null;

    return (
      <ResizerInner
        innerRef={resizerNode => {
          this.resizerNode = resizerNode;
        }}
        onMouseDown={this.mouseDownHandler}
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
      >
        {resizerButton}
      </ResizerInner>
    );
  }
}

// We use the isElectronMac theme value in Resizer's calculation methods, so need access to
// the theme props which withTheme provides.
// $FlowFixMe
export default withAnalyticsContext({ component: 'resizer' })(
  withAnalyticsEvents()(withTheme(Resizer)),
);
