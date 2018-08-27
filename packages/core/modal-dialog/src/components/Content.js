// @flow
import React, { Component } from 'react';
import rafSchedule from 'raf-schd';
import ScrollLock from 'react-scrolllock';

import Footer from './Footer';
import Header from './Header';

import type {
  AppearanceType,
  ChildrenType,
  ComponentType,
  FunctionType,
  KeyboardOrMouseEvent,
} from '../types';
import { Body, keylineHeight, Wrapper } from '../styled/Content';

function getInitialState() {
  return {
    showFooterKeyline: false,
    showHeaderKeyline: false,
    tabbableElements: [],
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
    Component to render the body of the modal.
  */
  body: ComponentType,
  /**
    Content of the modal
  */
  children?: ChildrenType,
  /**
    Component to render the header of the modal.
  */
  header?: ComponentType,
  /**
    Component to render the footer of the moda.l
  */
  footer?: ComponentType,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: KeyboardOrMouseEvent => void,
  /**
    Function that will be called when the modal changes position in the stack.
  */
  onStackChange?: number => void,
  /**
    Whether or not the body content should scroll
  */
  shouldScroll?: boolean,
  /**
    Boolean indicating if pressing the `esc` key should close the modal
  */
  shouldCloseOnEscapePress?: boolean,
  /**
    Boolean indicating content should be rendered on a transparent background.
  */
  isChromeless?: boolean,
  /**
    Number representing where in the stack of modals, this modal sits
  */
  stackIndex?: number,
  /**
    The modal title; rendered in the header.
  */
  heading?: string,
  /**
   * Makes heading multiline.
   * If false and heading is longer than one line overflow will be not displayed.
   */
  isHeadingMultiline?: boolean,
};

type State = {
  showFooterKeyline: boolean,
  showHeaderKeyline: boolean,
  tabbableElements: Array<{}>,
};

export default class Content extends Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    isChromeless: false,
    stackIndex: 0,
    body: Body,
    isHeadingMultiline: true,
  };

  escapeIsHeldDown: boolean = false;
  _isMounted: boolean = false;
  scrollContainer: HTMLElement | void;

  state: State = getInitialState();

  componentDidMount() {
    this._isMounted = true;

    // $FlowFixMe - issue with document.addEventListener - Enum incompatible
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);

    if (this.scrollContainer) {
      const capturedScrollContainer = this.scrollContainer;
      window.addEventListener('resize', this.determineKeylines, false);
      capturedScrollContainer.addEventListener(
        'scroll',
        this.determineKeylines,
        false,
      );
      this.determineKeylines();
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    const { stackIndex } = this.props;

    // update focus scope and let consumer know when stack index has changed
    if (nextProps.stackIndex && nextProps.stackIndex !== stackIndex) {
      this.handleStackChange(nextProps.stackIndex);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;

    // $FlowFixMe - issue with document.addEventListener - Enum incompatible
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);

    if (this.scrollContainer) {
      const capturedScrollContainer = this.scrollContainer;
      window.removeEventListener('resize', this.determineKeylines, false);
      capturedScrollContainer.removeEventListener(
        'scroll',
        this.determineKeylines,
        false,
      );
    }
  }

  determineKeylines = rafSchedule(() => {
    if (!this.scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
    const scrollableDistance = scrollHeight - clientHeight;
    const showHeaderKeyline = scrollTop > keylineHeight;
    const showFooterKeyline = scrollTop <= scrollableDistance - keylineHeight;

    this.setState({ showHeaderKeyline, showFooterKeyline });
  });
  getScrollContainer = (ref: HTMLElement) => {
    if (!ref) return;
    this.scrollContainer = ref;
  };
  handleKeyUp = () => {
    this.escapeIsHeldDown = false;
  };
  handleKeyDown = (event: SyntheticKeyboardEvent<any>) => {
    const { onClose, shouldCloseOnEscapePress, stackIndex = 0 } = this.props;

    // avoid consumers accidently closing multiple modals if they hold escape.
    if (this.escapeIsHeldDown) return;
    if (event.key === 'Escape') this.escapeIsHeldDown = true;

    // only the foremost modal should be interactive.
    if (!this._isMounted || stackIndex > 0) return;

    switch (event.key) {
      case 'Escape':
        if (shouldCloseOnEscapePress) onClose(event);
        break;
      default:
    }
  };
  handleStackChange = (stackIndex: number) => {
    const { onStackChange } = this.props;
    if (onStackChange) onStackChange(stackIndex);
  };

  render() {
    const {
      actions,
      appearance,
      body: ModalBody,
      children,
      footer,
      header,
      heading,
      onClose,
      isChromeless,
      isHeadingMultiline,
      shouldScroll,
    } = this.props;
    const { showFooterKeyline, showHeaderKeyline } = this.state;

    if (isChromeless) {
      return (
        <Wrapper>
          {children}
          <ScrollLock />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Header
          appearance={appearance}
          component={header}
          heading={heading}
          onClose={onClose}
          isHeadingMultiline={isHeadingMultiline}
          showKeyline={showHeaderKeyline}
        />
        <ModalBody
          innerRef={this.getScrollContainer}
          shouldScroll={shouldScroll}
        >
          {children}
        </ModalBody>
        <Footer
          actions={actions}
          appearance={appearance}
          component={footer}
          onClose={onClose}
          showKeyline={showFooterKeyline}
        />
        <ScrollLock />
      </Wrapper>
    );
  }
}
