// @flow
import React, { Component } from 'react';
import { layers } from '@atlaskit/theme';
import Portal from '@atlaskit/portal';

import type {
  AppearanceType,
  ChildrenType,
  ComponentType,
  ElementType,
  FunctionType,
  KeyboardOrMouseEvent,
} from '../types';

import Modal from './Modal';

export type Props = {
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
    Boolean indicating whether to focus on the first tabbable element inside the focus lock.
  */
  autoFocus: boolean | (() => HTMLElement | null),
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
    Whether or not the dialog is visible
  */
  isOpen: boolean,
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
  modalVisible: boolean,
};

class ModalWrapper extends Component<Props, State> {
  static defaultProps = {
    autoFocus: true,
    scrollBehavior: 'inside',
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    isChromeless: false,
    isOpen: true,
    width: 'medium',
    isHeadingMultiline: true,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      modalVisible: props.isOpen || state.modalVisible,
    };
  }

  state = {
    modalVisible: this.props.isOpen,
  };

  onModalClosed = (...args) => {
    this.setState({ modalVisible: false });
    if (this.props.onCloseComplete) {
      this.props.onCloseComplete(...args);
    }
  };

  render() {
    const { modalVisible } = this.state;
    return modalVisible ? (
      <Portal zIndex={layers.modal()}>
        <Modal {...this.props} onCloseComplete={this.onModalClosed} />
      </Portal>
    ) : null;
  }
}

export default ModalWrapper;
