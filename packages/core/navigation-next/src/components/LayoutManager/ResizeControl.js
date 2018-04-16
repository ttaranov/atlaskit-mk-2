// @flow

import React, { PureComponent, Fragment } from 'react';
import raf from 'raf-schd';
import { colors } from '@atlaskit/theme';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left-circle';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right-circle';
import interpolate, { clamp } from 'interpolate-range';

import { GLOBAL_NAV_WIDTH, PRODUCT_NAV_WIDTH } from '../../common';

function interpolateBlanketOpacity({ floor, ceil, val }) {
  const lerp = interpolate({
    inputRange: [floor, ceil],
    outputRange: [0, 0.2],
    fn: (f, c, v) => clamp(f, c, v * 3),
  });

  return lerp(val);
}

type WrapperProps = { isDragging: boolean, show: boolean };
const Wrapper = ({ isDragging, show, ...props }: WrapperProps) => (
  <div
    css={{
      cursor: isDragging ? 'ew-resize' : undefined,
      opacity: show ? 1 : 0,
      position: 'relative',
      transition: 'opacity 300ms cubic-bezier(0.2, 0, 0, 1) 80ms',
      width: 32,
    }}
    {...props}
  />
);
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
        pointerEvents: 'all',
        width: handleWidth,
      }}
      {...props}
    />
  );
};
type CursorBufferProps = { isDragging: boolean };
const CursorBuffer = ({ isDragging, ...props }: CursorBufferProps) => (
  <div
    css={{
      alignItems: 'stretch',
      cursor: 'ew-resize',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      left: -50,
      pointerEvents: isDragging ? 'all' : 'none',
      position: 'absolute',
      width: 100,
      zIndex: 1,
    }}
    {...props}
  />
);
const Button = props => (
  <button
    type="button"
    css={{
      background: 0,
      border: 0,
      boxSizing: 'content-box',
      color: colors.B200,
      cursor: 'pointer',
      height: 24,
      margin: 4,
      outline: 0,
      padding: 6,
      paddingRight: 0,
      position: 'absolute',
      width: 24,
    }}
    {...props}
  />
);
const Blanket = props => (
  <div
    css={{
      backgroundColor: colors.N900,
      bottom: 0,
      left: GLOBAL_NAV_WIDTH,
      position: 'fixed',
      top: 0,
      transform: 'translate3d(0, 0, 0)',
      zIndex: 0,
    }}
    {...props}
  />
);

type Props = {
  blanketStyle: Object,
  isTransitioning: boolean,
  mutationRefs: Array<{ ref: HTMLElement, property: string }>,
  navigation: Object,
};
type State = {
  didAutoCollapse: boolean,
  didDragOpen: boolean,
  initialWidth: number,
  initialX: number,
  isDragging: boolean,
  isVisible: boolean,
  width: number,
};

export default class ResizeControl extends PureComponent<Props, State> {
  invalidDragAttempted = false;
  lastWidth: number;
  state = {
    didAutoCollapse: false,
    didDragOpen: false,
    isDragging: false,
    isVisible: false,
    initialWidth: 0,
    initialX: 0,
    width: 0,
  };

  show = () => {
    this.setState({ isVisible: true });
  };
  hide = () => {
    this.setState({ isVisible: false });
  };

  collapseProductNav = () => {
    this.props.navigation.collapseProductNav();
    this.hide();
  };
  expandProductNav = () => {
    this.props.navigation.expandProductNav();
    this.hide();
  };
  toggleProductNav = () => {
    if (this.props.navigation.state.productNavIsCollapsed) {
      this.expandProductNav();
    } else {
      this.collapseProductNav();
    }
  };

  handleResizeStart = (event: MouseEvent) => {
    const initialX = event.pageX;

    this.setState({ initialX });

    // attach handlers (handleResizeStart is a bound to onMouseDown)
    window.addEventListener('mousemove', this.handleResize);
    window.addEventListener('mouseup', this.handleResizeEnd);
  };

  initializeDrag = (event: MouseEvent) => {
    const { navigation } = this.props;
    const delta = event.pageX - this.state.initialX;
    const isCollapsed = navigation.state.productNavIsCollapsed;

    // only initialize when drag intention is "opening"
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
        productNavIsCollapsed: false,
      });
    } else {
      navigation.manualResizeStart(navigation.state);
    }

    this.setState({ didDragOpen, initialWidth, isDragging: true });
  };

  handleResize = raf((event: MouseEvent) => {
    const { mutationRefs } = this.props;
    const { initialX, initialWidth, isDragging } = this.state;

    // initialize dragging, once
    if (!isDragging) {
      this.initializeDrag(event);
      return;
    }

    const delta = event.pageX - initialX;
    const width = initialWidth + delta;

    // apply updated styles to the applicable DOM nodes
    mutationRefs.forEach(({ property, ref }) => {
      const newValue = `${width}px`;
      const oldValue = ref.style.getPropertyValue(property);

      // mouse position hasn't exceeded a complete pixel, bail
      if (oldValue === newValue) return;

      // direct attribute manipulation
      ref.style.setProperty(property, newValue);
    });

    // NOTE: hijack the maual resize and force collapse, cancels mouse events
    if (event.screenX < window.screenX) {
      this.setState({ didAutoCollapse: true, width: 0 });
      this.handleResizeEnd();
    } else {
      // maintain internal width, applied to navigation state on resize end
      this.setState({ width });
    }
  });
  handleResizeEnd = () => {
    const { navigation } = this.props;
    const { didDragOpen, isDragging, initialX, width } = this.state;

    let publishWidth = width;
    let shouldCollapse = this.state.didAutoCollapse;

    // check if the intention was just a click, and toggle
    if (!isDragging && !this.invalidDragAttempted) {
      publishWidth = Math.max(PRODUCT_NAV_WIDTH, width);
      this.toggleProductNav();
    }

    // prevent the user from creating an unusable width
    if (publishWidth < PRODUCT_NAV_WIDTH) {
      // when dragged open and dropped below the min-width we reset the published
      // width to its default, otherwise use wherever they dragged from.
      publishWidth = didDragOpen
        ? PRODUCT_NAV_WIDTH
        : initialX - GLOBAL_NAV_WIDTH;

      shouldCollapse = true;
      this.hide();
    } else {
      shouldCollapse = navigation.state.productNavIsCollapsed;
    }

    // publish the new width, once resizing completes
    navigation.manualResizeEnd({
      productNavWidth: publishWidth,
      productNavIsCollapsed: shouldCollapse,
    });

    // reset everything
    this.invalidDragAttempted = false;
    this.setState({
      didAutoCollapse: false,
      didDragOpen: false,
      isDragging: false,
      width: publishWidth,
    });

    // cleanup
    window.removeEventListener('mousemove', this.handleResize);
    window.removeEventListener('mouseup', this.handleResizeEnd);
  };

  renderBlanket = () => {
    const { isTransitioning, blanketStyle } = this.props;
    const { didDragOpen, isDragging, width } = this.state;

    // store the "last width" for use when transitioning
    this.lastWidth = isTransitioning ? this.lastWidth : width;

    const dynamicWidth = isTransitioning ? blanketStyle.width : this.lastWidth;
    const actualWidth = didDragOpen ? width : dynamicWidth;

    if ((width > PRODUCT_NAV_WIDTH || !isDragging) && !isTransitioning) {
      return null;
    }

    const opacity = interpolateBlanketOpacity({
      floor: PRODUCT_NAV_WIDTH,
      ceil: 0,
      val: actualWidth,
    });

    return <Blanket style={{ opacity, ...blanketStyle, width: actualWidth }} />;
  };

  render() {
    const { isDragging, isVisible } = this.state;
    const { navigation } = this.props;
    const { productNavIsCollapsed } = navigation.state;

    // account for rare case where the user moves their mouse fast enough
    // to invoke a leave event and "hide" the resize control
    const shouldBeVisible = isDragging || isVisible;
    const ButtonIcon = productNavIsCollapsed ? ChevronRight : ChevronLeft;

    return (
      <Fragment>
        <Wrapper
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          show={shouldBeVisible}
          isDragging={isDragging}
        >
          <CursorBuffer isDragging={isDragging}>
            <Handle onMouseDown={this.handleResizeStart} />
          </CursorBuffer>
          <Button onClick={this.toggleProductNav}>
            <ButtonIcon />
          </Button>
        </Wrapper>
        {this.renderBlanket()}
      </Fragment>
    );
  }
}
