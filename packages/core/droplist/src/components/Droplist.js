// @flow

import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Layer from '@atlaskit/layer';
import Spinner from '@atlaskit/spinner';
import { ThemeProvider } from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import Wrapper, {
  Content,
  SpinnerContainer,
  Trigger,
} from '../styled/Droplist';
import itemTheme from '../theme/item-theme';

const halfFocusRing = 1;
const dropOffset = `0 ${gridSize()}px`;

type Props = {
  /**
   * Controls the appearance of the menu.
   * Default menu has scroll after its height exceeds the pre-defined amount.
   * Tall menu has no restrictions.
   */
  appearance?: 'default' | 'tall',
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent',
  /** Content that will be rendered inside the layer element. Should typically be
   * `ItemGroup` or `Item`, or checkbox / radio variants of those. */
  children?: Node,
  /** If true, a Spinner is rendered instead of the items */
  isLoading?: boolean,
  /** Controls the open state of the drop list. */
  isOpen?: boolean,
  onClick?: any => mixed,
  onKeyDown?: any => mixed,
  onOpenChange?: any => mixed,
  /** Position of the menu. See the documentation of @atlaskit/layer for more details. */
  position?: string,
  /** Deprecated. Option to display multiline items when content is too long.
   * Instead of ellipsing the overflown text it causes item to flow over multiple lines.
   */
  shouldAllowMultilineItems?: boolean,
  /** Option to fit dropdown menu width to its parent width */
  shouldFitContainer?: boolean,
  /** Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
   * fit in the viewport. */
  shouldFlip?: boolean,
  /** Controls the height at which scroll bars will appear on the drop list. */
  maxHeight?: number,
  /** Content which will trigger the drop list to open and close. */
  trigger?: Node,
};

export default class Droplist extends Component<Props, void> {
  static defaultProps = {
    appearance: 'default',
    boundariesElement: 'viewport',
    children: null,
    isLoading: false,
    isOpen: false,
    onClick: () => {},
    onKeyDown: () => {},
    onOpenChange: () => {},
    position: 'bottom left',
    shouldAllowMultilineItems: false,
    shouldFitContainer: false,
    shouldFlip: true,
    trigger: null,
  };

  static childContextTypes = {
    shouldAllowMultilineItems: PropTypes.bool,
  };

  getChildContext() {
    return { shouldAllowMultilineItems: this.props.shouldAllowMultilineItems };
  }

  componentDidMount = () => {
    this.setContentWidth();
    // We use a captured event here to avoid a radio or checkbox dropdown item firing its
    // click event first, which would cause a re-render of the element and prevent Droplist
    // from detecting the actual source of this original click event.
    document.addEventListener('click', this.handleClickOutside, true);
    document.addEventListener('keydown', this.handleEsc);
  };

  componentDidUpdate = () => {
    if (this.props.isOpen) {
      this.setContentWidth();
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('keydown', this.handleEsc);
  };

  setContentWidth = (): void => {
    const { dropContentRef, triggerRef } = this;
    const { shouldFitContainer } = this.props;

    // We need to manually set the content width to match the trigger width
    // if props.shouldFitContainer is true
    if (shouldFitContainer && dropContentRef && triggerRef) {
      dropContentRef.style.width = `${triggerRef.offsetWidth -
        halfFocusRing * 2}px`;
    }
  };

  dropContentRef: HTMLElement;
  triggerRef: HTMLElement;

  handleEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close(event);
    }
  };

  handleClickOutside = (event: Event): void => {
    if (this.props.isOpen) {
      const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

      if (
        !domNode ||
        // $FlowFixMe
        (event.target instanceof Node && !domNode.contains(event.target))
      ) {
        this.close(event);
      }
    }
  };

  close = (event: Event): void => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange({ isOpen: false, event });
    }
  };

  handleContentRef = (ref: HTMLElement) => {
    this.dropContentRef = ref;

    // If the dropdown has just been opened, we focus on the containing element so the
    // user can tab to the first dropdown item. We will only receive this ref if isOpen
    // is true or null, so no need to check for truthiness here.
    if (ref) {
      ref.focus();
    }
  };

  handleTriggerRef = (ref: HTMLElement) => {
    this.triggerRef = ref;
  };

  render() {
    const {
      appearance,
      boundariesElement,
      children,
      isLoading,
      isOpen,
      maxHeight,
      onClick,
      onKeyDown,
      position,
      shouldFitContainer,
      shouldFlip,
      trigger,
    } = this.props;

    const layerContent = isOpen ? (
      <Content
        data-role="droplistContent"
        isTall={appearance === 'tall'}
        innerRef={this.handleContentRef}
        maxHeight={maxHeight}
      >
        {isLoading ? (
          <SpinnerContainer>
            <Spinner size="small" />
          </SpinnerContainer>
        ) : (
          <ThemeProvider theme={itemTheme}>
            <div>{children}</div>
          </ThemeProvider>
        )}
      </Content>
    ) : null;

    return (
      <Wrapper fit={shouldFitContainer} onClick={onClick} onKeyDown={onKeyDown}>
        <Layer
          autoFlip={shouldFlip}
          boundariesElement={boundariesElement}
          content={layerContent}
          offset={dropOffset}
          // $FlowFixMe
          position={position}
        >
          <Trigger fit={shouldFitContainer} innerRef={this.handleTriggerRef}>
            {trigger}
          </Trigger>
        </Layer>
      </Wrapper>
    );
  }
}
