// @flow

import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Spinner from '@atlaskit/spinner';
import NodeResolver from 'react-node-resolver';
import { ThemeProvider } from 'styled-components';
import { Manager, Reference, Popper } from '@atlaskit/popper';
import type { Placement } from '@atlaskit/popper';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Content, SpinnerContainer } from '../styled/Droplist';
import itemTheme from '../theme/item-theme';

const halfFocusRing = 1;

type Props = {
  /**
   * Controls the appearance of the menu.
   * Default menu has scroll after its height exceeds the pre-defined amount.
   * Tall menu has no scroll until the height exceeds the height of the viewport.
   */
  appearance: 'default' | 'tall',
  /** Content that will be rendered inside the layer element. Should typically be
   * `ItemGroup` or `Item`, or checkbox / radio variants of those. */
  children: Node,
  /** If true, a Spinner is rendered instead of the items */
  isLoading: boolean,
  /** Controls the open state of the drop list. */
  isOpen: boolean,
  onClick: any => mixed,
  onKeyDown: any => mixed,
  onOpenChange: any => mixed,
  /** Position of the menu. See the documentation of @atlaskit/layer for more details. */
  placement: Placement,
  /** Deprecated. Option to display multiline items when content is too long.
   * Instead of ellipsing the overflown text it causes item to flow over multiple lines.
   */
  shouldAllowMultilineItems: boolean,
  /** Option to fit dropdown menu width to its parent width */
  shouldFitContainer: boolean,
  /** Controls the height at which scroll bars will appear on the drop list. */
  maxHeight?: number,
  /** Content which will trigger the drop list to open and close. */
  trigger: Node,
};

class Droplist extends Component<Props, void> {
  static defaultProps = {
    appearance: 'default',
    isLoading: false,
    isOpen: false,
    onClick: () => {},
    onKeyDown: () => {},
    onOpenChange: () => {},
    placement: 'bottom-start',
    shouldAllowMultilineItems: false,
    shouldFitContainer: false,
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
      // $FlowFixMe - flow is lost and if not an instance of Node
      if (event.target instanceof Node) {
        // Rather than check for the target within the entire Droplist, we specify the trigger/content.
        // This aids with future effort in scroll-locking Droplist when isMenuFixed is enabled; the scroll
        // blanket which stretches to the viewport should not stop 'close' from being triggered.
        const withinTrigger =
          this.triggerRef && this.triggerRef.contains(event.target);
        const withinContent =
          this.dropContentRef && this.dropContentRef.contains(event.target);

        if (!withinTrigger && !withinContent) {
          this.close(event);
        }
      }
    }
  };

  close = (event: Event): void => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange({ isOpen: false, event });
    }
  };

  render() {
    const {
      appearance,
      children,
      isLoading,
      isOpen,
      maxHeight,
      onClick,
      onKeyDown,
      placement,
      trigger,
    } = this.props;

    const layerContent = isOpen ? (
      <Popper placement={placement}>
        {({ ref, style, outOfBoundaries }) => (
          <Content
            onClick={onClick}
            onKeyDown={onKeyDown}
            data-role="droplistContent"
            isTall={appearance === 'tall'}
            outOfBoundaries={outOfBoundaries}
            innerRef={node => {
              this.dropContentRef = node;
              ref(node);
            }}
            maxHeight={maxHeight}
            style={style}
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
        )}
      </Popper>
    ) : null;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <NodeResolver
              innerRef={node => {
                this.triggerRef = node;
                ref(node);
              }}
            >
              {trigger}
            </NodeResolver>
          )}
        </Reference>
        {layerContent}
      </Manager>
    );
  }
}

export { Droplist as DroplistWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'droplist',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onOpenChange: createAndFireEventOnAtlaskit({
      action: 'toggled',
      actionSubject: 'droplist',

      attributes: {
        componentName: 'droplist',
        packageName,
        packageVersion,
      },
    }),
  })(Droplist),
);
