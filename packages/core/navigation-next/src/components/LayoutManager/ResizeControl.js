// @flow

import React, { PureComponent, Fragment } from 'react';
import { css } from 'emotion';
import raf from 'raf-schd';
import {
  withAnalyticsEvents,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { colors } from '@atlaskit/theme';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left-circle';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right-circle';

import { navigationExpandedCollapsed } from '../../common/analytics';
import { GLOBAL_NAV_WIDTH, CONTENT_NAV_WIDTH } from '../../common/constants';
import { Shadow } from '../../common/primitives';
import PropertyToggle from './PropertyToggle';

const OUTER_WIDTH = 32;

const Outer = props => (
  <div css={{ position: 'relative', width: OUTER_WIDTH }} {...props} />
);
const innerStyles = css({
  height: '100%',
  opacity: 0,
  position: 'relative',
  transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1) 80ms',
  width: OUTER_WIDTH,
  ':hover': {
    opacity: 1,
  },
});

const Inner = ({ ...props }) => <div className={innerStyles} {...props} />;
const Handle = props => {
  const handleWidth = 12;
  const lineWidth = 2;

  // prepare color stops
  const csOne = `${handleWidth / 2 - lineWidth / 2}px`;
  const csTwo = `${handleWidth / 2 + lineWidth / 2}px`;

  return (
    <div
      css={{
        background: `linear-gradient(to right, transparent, transparent ${csOne},
          ${colors.B200} ${csOne}, ${colors.B200} ${csTwo},
          transparent ${csTwo}, transparent)`,
        cursor: 'ew-resize',
        height: '100%',
        left: -(handleWidth / 2 - lineWidth / 2),
        pointerEvents: 'all',
        position: 'absolute',
        width: handleWidth,
        zIndex: 1,
      }}
      {...props}
    />
  );
};
const Button = ({ ...props }) => (
  <button
    type="button"
    css={{
      background: 0,
      border: 0,
      boxSizing: 'content-box',
      cursor: 'pointer',
      height: 24,
      margin: 4,
      outline: 0,
      padding: 6,
      paddingRight: 0,
      position: 'absolute',
      width: 24,
      transform: 'translateX(-20%)',
      transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
      transitionDelay: 0,

      ':focus': {
        boxShadow: 'none',
      },

      [`.${innerStyles}:hover &`]: {
        transform: 'translateX(0)',
        transitionDelay: '120ms',
      },

      '& svg': {
        color: 'transparent',
        fill: colors.B200,
        transition: 'color 100ms linear, fill 100ms linear',
      },

      ':hover svg, :focus svg': {
        color: colors.B200,
        fill: colors.N0,
      },
    }}
    {...props}
  />
);

// tinker with the DOM directly by setting style properties, makes the
function applyMutations(
  elements: Array<{ property: string, ref: HTMLElement }>,
  width: number,
) {
  elements.forEach(({ property, ref }) => {
    const newValue = `${width}px`;
    const oldValue = ref.style.getPropertyValue(property);

    // avoid thrashing
    if (oldValue === newValue) return;

    // direct attribute manipulation
    ref.style.setProperty(property, newValue);
  });
}

type Props = WithAnalyticsEventsProps & {
  children: State => any,
  mutationRefs: Array<{ ref: HTMLElement, property: string }>,
  navigation: Object,
};
type State = {
  delta: number,
  didDragOpen: boolean,
  initialWidth: number,
  initialX: number,
  isDragging: boolean,
  mouseIsDown: boolean,
  width: number,
};

class ResizeControl extends PureComponent<Props, State> {
  invalidDragAttempted = false;
  lastWidth: number;
  wrapper: HTMLElement;
  state = {
    delta: 0,
    didDragOpen: false,
    isDragging: false,
    initialWidth: 0,
    initialX: 0,
    mouseIsDown: false,
    width: this.props.navigation.state.productNavWidth,
  };

  onResizerChevronClick = () => {
    this.toggleCollapse('chevron');
  };

  toggleCollapse = trigger => {
    const { navigation, createAnalyticsEvent } = this.props;
    const newCollapsedState = !navigation.state.isCollapsed;
    navigation.toggleCollapse();
    navigationExpandedCollapsed(createAnalyticsEvent, {
      trigger,
      isCollapsed: newCollapsedState,
    });
  };

  handleResizeStart = (event: MouseEvent) => {
    const initialX = event.pageX;

    this.setState({ initialX, mouseIsDown: true });

    // attach handlers (handleResizeStart is a bound to onMouseDown)
    window.addEventListener('mousemove', this.handleResize);
    window.addEventListener('mouseup', this.handleResizeEnd);
  };

  initializeDrag = (event: MouseEvent) => {
    const { navigation } = this.props;
    const delta = event.pageX - this.state.initialX;
    const isCollapsed = navigation.state.isCollapsed;

    // only initialize when drag intention is "expand"
    if (isCollapsed && delta <= 0) {
      this.invalidDragAttempted = true;
      return;
    }

    let initialWidth = navigation.state.productNavWidth;
    let didDragOpen = false;

    // NOTE
    // if the product nav is collapsed and the consumer starts dragging it open
    // we must expand it and drag should start from 0.
    if (isCollapsed) {
      initialWidth = 0;
      didDragOpen = true;
      navigation.manualResizeStart({
        productNavWidth: 0,
        isCollapsed: false,
      });
    } else {
      navigation.manualResizeStart(navigation.state);
    }

    this.setState({ didDragOpen, initialWidth, isDragging: true });
  };

  handleResize = raf((event: MouseEvent) => {
    const { mutationRefs } = this.props;
    const { initialX, initialWidth, isDragging, mouseIsDown } = this.state;

    // on occasion a mouse move event occurs before the event listeners
    // have a chance to detach
    if (!mouseIsDown) return;

    // initialize dragging
    if (!isDragging) {
      this.initializeDrag(event);
      return;
    }

    // allow the product nav to be 75% of the available page width
    const maxWidth = window.innerWidth / 4 * 3;
    const adjustedMax = Math.round(maxWidth) - initialWidth - GLOBAL_NAV_WIDTH;

    const delta = Math.min(event.pageX - initialX, adjustedMax);
    const width = initialWidth + delta;

    // apply updated styles to the applicable DOM nodes
    applyMutations(mutationRefs, width);

    // NOTE: hijack the maual resize and force collapse, cancels mouse events
    if (event.screenX < window.screenX) {
      this.setState({ width: 0 });
      this.handleResizeEnd();
    } else {
      // maintain internal width, applied to navigation state on resize end
      this.setState({ delta, width });
    }
  });
  handleResizeEnd = () => {
    const { navigation, createAnalyticsEvent } = this.props;
    const { delta, didDragOpen, isDragging, width } = this.state;

    let publishWidth = width;
    let shouldCollapse;
    const expandThreshold = 24;

    // check if the intention was just a click, and toggle
    if (!isDragging && !this.invalidDragAttempted) {
      publishWidth = Math.max(CONTENT_NAV_WIDTH, width);
      this.toggleCollapse('resizerClick');
    }

    // prevent the user from creating an unusable width
    if (publishWidth < CONTENT_NAV_WIDTH) {
      publishWidth = CONTENT_NAV_WIDTH;

      if (didDragOpen && delta > expandThreshold) {
        shouldCollapse = false;
      } else {
        shouldCollapse = true;
      }
    } else {
      shouldCollapse = navigation.state.isCollapsed;
    }

    if ((didDragOpen && !shouldCollapse) || (!didDragOpen && shouldCollapse)) {
      navigationExpandedCollapsed(createAnalyticsEvent, {
        trigger: 'resizerDrag',
        isCollapsed: shouldCollapse,
      });
    }

    // reset everything
    this.invalidDragAttempted = false;
    this.setState({
      didDragOpen: false,
      isDragging: false,
      mouseIsDown: false,
      width: publishWidth,
    });

    // publish the new width, once resizing completes
    navigation.manualResizeEnd({
      productNavWidth: publishWidth,
      isCollapsed: shouldCollapse,
    });

    // cleanup
    window.removeEventListener('mousemove', this.handleResize);
    window.removeEventListener('mouseup', this.handleResizeEnd);
  };

  render() {
    const { didDragOpen, isDragging, mouseIsDown } = this.state;
    const { children, navigation } = this.props;
    const { isCollapsed } = navigation.state;

    const isDisabled = navigation.state.isPeeking;

    // the button shouldn't "flip" until the drag is complete
    const ButtonIcon =
      isCollapsed || (didDragOpen && isDragging) ? ChevronRight : ChevronLeft;

    return (
      <Fragment>
        {children(this.state)}
        {isDisabled ? null : (
          <Fragment>
            <Outer>
              <Shadow isBold={mouseIsDown} />
              <Inner>
                <Handle onMouseDown={this.handleResizeStart} />
                <Button onClick={this.onResizerChevronClick}>
                  <ButtonIcon />
                </Button>
              </Inner>
            </Outer>
            <PropertyToggle
              isActive={isDragging}
              styles={{ cursor: 'ew-resize' }}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default withAnalyticsEvents()(ResizeControl);
