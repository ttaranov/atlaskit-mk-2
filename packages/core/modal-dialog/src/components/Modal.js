// @flow
import React, { Component } from 'react';
import { FocusLock, withRenderTarget } from '@atlaskit/layer-manager';
import Blanket from '@atlaskit/blanket';

import type {
  AppearanceType,
  ChildrenType,
  ComponentType,
  ElementType,
  FunctionType,
  KeyboardOrMouseEvent,
} from '../types';
import { WIDTH_ENUM } from '../shared-variables';

import {
  PositionerAbsolute,
  PositionerRelative,
  Dialog,
  FillScreen as StyledFillScreen,
} from '../styled/Modal';
import { Fade, SlideUp } from './Animation';
import Content from './Content';

// NOTE: Rename transition components so it's easier to read the render method
const FillScreen = props => <Fade component={StyledFillScreen} {...props} />;
// eslint-disable-next-line react/prop-types
const Positioner = ({ scrollBehavior, ...props }) => {
  const component =
    scrollBehavior === 'inside' ? PositionerAbsolute : PositionerRelative;

  return <SlideUp component={component} {...props} />;
};

function getScrollDistance() {
  return (
    window.pageYOffset ||
    // $FlowFixMe
    document.documentElement.scrollTop ||
    // $FlowFixMe
    document.body.scrollTop ||
    0
  );
}
function getInitialState() {
  return {
    dialogNode: null,
    scrollDistance: getScrollDistance(),
    hasEntered: false,
    isExiting: false,
  };
}

type Props = {
  /**
    Buttons to render in the footer
  */
  actions?: Array<{
    onClick?: FunctionType,
    text?: string,
  }>,
  /**
    Appearance of the primary action. Also adds an icon to the heading, if provided.
  */
  appearance?: AppearanceType,
  /**
    Boolean OR Function indicating which element to focus when the component mounts.
    By default the modal itself will be focused.
    FALSE assumes that autofocus is set on an element within the modal.
    TRUE will automatically find the first "tabbable" element within the modal.
    Providing a function should return the element you want to focus.
  */
  autoFocus: boolean | (() => ElementType) | void,
  components: { Body: ComponentType },
  /**
    Content of the modal
  */
  children?: ChildrenType,
  /**
    Component to render the body of the modal, replaces the internal implementation.
  */
  body?: ComponentType,
  /**
    Component to render the footer of the modal, replaces internal implementation.
  */
  footer?: ComponentType,
  /**
    Component to render the header of the modal, replaces internal implementation.
  */
  header?: ComponentType,
  /**
    The modal title; rendered in the header.
  */
  heading?: string,
  /**
   * Makes heading multiline.
   * If false and heading is longer than one line overflow will be not displayed.
   */
  isHeadingMultiline?: boolean,
  /**
    Height of the modal. If not set, the modal grows to fit the content until it
    runs out of vertical space, at which point scrollbars appear. If a number is
    provided, the height is set to that number in pixels. A string including pixels,
    or a percentage, will be directly applied as a style. Several size options are
    also recognised.
  */
  height?: number | string,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: KeyboardOrMouseEvent => void,
  /**
    Function that will be called when the exit transition is complete.
  */
  onCloseComplete?: ElementType => void,
  /**
    Function that will be called when the enter transition is complete.
  */
  onOpenComplete?: (node: ElementType, isAppearing: boolean) => void,
  /**
    Function that will be called when the modal changes position in the stack.
  */
  onStackChange?: number => void,
  /**
    Where scroll behaviour should originate. When `inside` scroll only occurs
    on the modal body. When `outside` the entire modal will scroll within the viewport.
  */
  scrollBehavior?: 'inside' | 'outside',
  /**
    Boolean indicating if clicking the overlay should close the modal.
  */
  shouldCloseOnOverlayClick?: boolean,
  /**
    Boolean indicating if pressing the `esc` key should close the modal.
  */
  shouldCloseOnEscapePress?: boolean,
  /**
    Boolean indicating content should be rendered on a transparent background.
  */
  isChromeless?: boolean,
  /**
    Number representing where this instance lives in the stack of modals.
  */
  stackIndex?: number,
  /**
    Width of the modal. This can be provided in three different ways.
    If a number is provided, the width is set to that number in pixels.
    A string including pixels, or a percentage, will be directly applied as a style.
    Several size options are also recognised.
  */
  width?: number | string | ('small' | 'medium' | 'large' | 'x-large'),
};

type State = {
  dialogNode: Node | null,
  scrollDistance: number,
  isExiting: boolean,
  hasEntered: boolean,
};

class Modal extends Component<Props, State> {
  props: Props; // eslint-disable-line react/sort-comp
  static defaultProps = {
    autoFocus: undefined,
    scrollBehavior: 'inside',
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    isChromeless: false,
    stackIndex: 0,
    width: 'medium',
    isHeadingMultiline: true,
  };

  state: State = getInitialState();

  // getDialogNode = (dialogNode) => {
  //   this.setState(state => !state.dialogNode && ({ dialogNode }));
  // }

  componentDidMount() {
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  /* Prevent window from being scrolled programatically so that the modal is positioned correctly
   * and to prevent scrollIntoView from scrolling the window.
   */
  handleWindowScroll = () => {
    if (getScrollDistance() !== this.state.scrollDistance) {
      window.scrollTo(window.pageXOffset, this.state.scrollDistance);
    }
  };

  handleOverlayClick = e => {
    if (this.props.shouldCloseOnOverlayClick) {
      // $FlowFixMe TEMPORARY
      this.props.onClose(e);
    }
  };
  handleDialogClick = event => {
    event.stopPropagation();
  };
  handleEntered = (...args) => {
    this.setState({
      hasEntered: true,
    });
    if (this.props.onOpenComplete) {
      this.props.onOpenComplete(...args);
    }
  };
  handleExit = () => {
    window.removeEventListener('scroll', this.handleWindowScroll);
    // disable FocusLock *before* unmount. animation may end after a new modal
    // has gained focus, breaking focus behaviour.
    this.setState({ isExiting: true });
  };

  render() {
    // NOTE: `in` is NOT public API, thus not documented (provided by react-transition-group)
    const {
      actions,
      appearance,
      autoFocus,
      body,
      children,
      footer,
      header,
      height,
      // $FlowFixMe
      in: transitionIn, // eslint-disable-line react/prop-types
      isChromeless,
      isHeadingMultiline,
      onClose,
      onCloseComplete,
      onStackChange,
      shouldCloseOnEscapePress,
      stackIndex,
      heading,
      width,
      scrollBehavior,
    } = this.props;

    const { isExiting, scrollDistance } = this.state;

    const isBackground = stackIndex != null && stackIndex > 0;
    const transitionProps = { in: transitionIn, stackIndex };

    // If a custom width (number or percentage) is supplied, set inline style
    // otherwise allow styled component to consume as named prop
    const widthName = WIDTH_ENUM.values.includes(width) ? width : null;
    const widthValue = widthName ? null : width;

    // Pass an afterEnded custom transition to Positioner so we can update styles to remove the transform property
    // This fixes an issue with react-beautiful-dnd within modals - AK-4328
    const customTransition =
      this.state.hasEntered && !this.state.isExiting && !isBackground
        ? 'afterEntered'
        : '';

    return (
      <FillScreen
        {...transitionProps}
        aria-hidden={isBackground}
        onExit={this.handleExit}
        scrollDistance={scrollDistance}
      >
        <Blanket isTinted onBlanketClicked={this.handleOverlayClick} />
        <Positioner
          {...transitionProps}
          customTransition={customTransition}
          onClick={this.handleOverlayClick}
          onEntered={this.handleEntered}
          onExited={onCloseComplete}
          scrollBehavior={scrollBehavior}
          widthName={widthName}
          widthValue={widthValue}
        >
          <FocusLock
            enabled={stackIndex === 0 && !isExiting}
            autoFocus={autoFocus}
          >
            <Dialog
              heightValue={height}
              isChromeless={isChromeless}
              onClick={this.handleDialogClick}
              role="dialog"
              tabIndex="-1"
            >
              <Content
                actions={actions}
                appearance={appearance}
                footer={footer}
                heading={heading}
                isHeadingMultiline={isHeadingMultiline}
                header={header}
                onClose={onClose}
                shouldScroll={scrollBehavior === 'inside'}
                shouldCloseOnEscapePress={shouldCloseOnEscapePress}
                onStackChange={onStackChange}
                isChromeless={isChromeless}
                stackIndex={stackIndex}
                body={body}
              >
                {children}
              </Content>
            </Dialog>
          </FocusLock>
        </Positioner>
      </FillScreen>
    );
  }
}

export default withRenderTarget(
  {
    target: 'modal',
    withTransitionGroup: true,
  },
  // $FlowFixMe TEMPORARY
  Modal,
);
