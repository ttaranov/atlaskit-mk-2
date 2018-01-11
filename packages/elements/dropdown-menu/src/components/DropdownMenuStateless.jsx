// @flow

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import uid from 'uid';
import Button from '@atlaskit/button';
import Droplist, { Item, Group } from '@atlaskit/droplist';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import DropdownItemFocusManager from './context/DropdownItemFocusManager';
import DropdownItemClickManager from './context/DropdownItemClickManager';
import DropdownItemSelectionCache from './context/DropdownItemSelectionCache';
import WidthConstrainer from '../styled/WidthConstrainer';
import { KEY_DOWN, KEY_SPACE, KEY_ENTER } from '../util/keys';
import type { DeprecatedItem, DeprecatedItemGroup, DropdownMenuStatelessProps } from '../types';

type OpenCloseArgs = {
  event: MouseEvent | KeyboardEvent,
  source?: 'click' | 'keydown',
};

export default class DropdownMenuStateless extends Component {
  props: DropdownMenuStatelessProps // eslint-disable-line react/sort-comp

  static defaultProps = {
    appearance: 'default',
    boundariesElement: 'viewport',
    isLoading: false,
    isOpen: false,
    items: [],
    onItemActivated: () => {},
    onOpenChange: () => {},
    position: 'bottom left',
    shouldAllowMultilineItems: false,
    shouldFitContainer: false,
    shouldFlip: true,
    triggerButtonProps: {},
    triggerType: 'default',
  }

  state = {
    id: uid(),
  }

  componentDidMount = () => {
    if (this.isUsingDeprecatedAPI()) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('DropdownMenu.items is deprecated. Please switch to the declarative API.');
      }

      if (this.domItemsList) {
        this.focusFirstItem();
      }
    }
  }

  componentDidUpdate = (prevProp: DropdownMenuStatelessProps) => {
    if (this.isUsingDeprecatedAPI() && this.props.isOpen && !prevProp.isOpen) {
      this.focusFirstItem();
    }
  }

  getNextFocusable = (indexItem?: ?number, available?: number) => {
    if (!this.domItemsList) {
      return null;
    }

    let currentItem = (typeof indexItem !== 'number') ? -1 : indexItem;
    const latestAvailable = (typeof available !== 'number') ? currentItem : available;

    if (currentItem < this.domItemsList.length - 1) {
      currentItem++;

      if (this.domItemsList[currentItem].getAttribute('aria-hidden') !== 'true') {
        return currentItem;
      }

      return this.getNextFocusable(currentItem, latestAvailable);
    }

    return latestAvailable;
  }

  getPrevFocusable = (indexItem?: ?number, available?: number) => {
    if (!this.domItemsList) {
      return null;
    }

    let currentItem = (typeof indexItem !== 'number') ? -1 : indexItem;
    const latestAvailable = (typeof available !== 'number') ? currentItem : available;

    if (currentItem && currentItem > 0) {
      currentItem--;

      if (this.domItemsList[currentItem].getAttribute('aria-hidden') !== 'true') {
        return currentItem;
      }

      return this.getPrevFocusable(currentItem, latestAvailable);
    }

    return latestAvailable || currentItem;
  }

  domItemsList: ?NodeList<HTMLElement>

  focusedItem: ?number

  triggerContainer: HTMLElement

  sourceOfIsOpen: ?string

  focusFirstItem = () => {
    if (this.sourceOfIsOpen === 'keydown') {
      this.focusItem(this.getNextFocusable());
    }
  }

  focusNextItem = () => {
    this.focusItem(this.getNextFocusable(this.focusedItem));
  }

  focusPreviousItem = () => {
    this.focusItem(this.getPrevFocusable(this.focusedItem));
  }

  focusItem = (index: ?number) => {
    if (!this.domItemsList || !index) {
      return;
    }

    this.focusedItem = index;
    this.domItemsList[this.focusedItem].focus();
  }

  isTargetChildItem = (target: Element) => {
    if (!target) return false;

    const isDroplistItem = target.getAttribute('data-role') === 'droplistItem';

    // eslint-disable-next-line react/no-find-dom-node
    const thisDom = findDOMNode(this);
    return isDroplistItem && thisDom ? thisDom.contains(target) : false;
  }

  handleKeyboardInteractionForClosed = (event: KeyboardEvent) => {
    if (this.props.isOpen) {
      return;
    }

    switch (event.key) {
      case KEY_DOWN:
      case KEY_SPACE:
      case KEY_ENTER:
        event.preventDefault();
        this.open({ event, source: 'keydown' });
        break;
      default:
        break;
    }
  }

  handleKeyboardInteractionsDeprecated = (event: KeyboardEvent) => {
    // KeyboardEvent.target is typed as an EventTarget but we need to access methods on it which
    // are specific to Element. Due limitations of the HTML spec flow doesn't know that an
    // EventTarget can have these methods, so we cast it to Element through Object. This is the
    // safest thing we can do in this situation.
    // https://flow.org/en/docs/types/casting/#toc-type-casting-through-any
    const target: Element = (event.target: Object);
    if (this.props.isOpen) {
      if (this.isTargetChildItem(target)) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            this.focusPreviousItem();
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.focusNextItem();
            break;
          case 'Tab':
            event.preventDefault();
            this.close({ event });
            break;
          default:
            break;
        }
      } else if (event.key === 'ArrowDown') {
        this.sourceOfIsOpen = 'keydown';
        this.focusFirstItem();
      } else if (event.key === 'Tab') {
        this.close({ event });
      }
    } else {
      switch (event.key) {
        case KEY_DOWN:
        case KEY_SPACE:
        case KEY_ENTER:
          event.preventDefault();
          this.open({ event, source: 'keydown' });
          break;
        default:
          break;
      }
    }
  }

  domMenuContainer: ?HTMLElement

  handleClickDeprecated = (event: MouseEvent) => {
    const menuContainer = this.domMenuContainer;
    // Casting target to Element. See comment in `handleKeyboardInteractionsDeprecated`.
    const target: Element = (event.target: Object);
    if (!menuContainer || (menuContainer && !menuContainer.contains(target))) {
      this.toggle({ source: 'click', event });
    }
  }

  isUsingDeprecatedAPI = () => Boolean(this.props.items.length)

  handleClick = (event: MouseEvent) => {
    if (this.isUsingDeprecatedAPI()) {
      this.handleClickDeprecated(event);
      return;
    }

    const { triggerContainer } = this;
    // Casting target to Element. See comment in `handleKeyboardInteractionsDeprecated`.
    const target: Element = (event.target: Object);
    if (triggerContainer && triggerContainer.contains(target) && target.disabled !== true) {
      const { isOpen } = this.props;
      this.sourceOfIsOpen = 'mouse';
      this.props.onOpenChange({ isOpen: !isOpen, event });
    }
  }

  triggerContent = () => {
    const { children, trigger, isOpen, triggerButtonProps, triggerType } = this.props;
    const insideTriggerContent = this.isUsingDeprecatedAPI() ? children : trigger;

    if (triggerType !== 'button') {
      return insideTriggerContent;
    }

    const triggerProps = { ...triggerButtonProps };
    const defaultButtonProps = {
      ariaControls: this.state.id,
      ariaExpanded: isOpen,
      ariaHaspopup: true,
      isSelected: isOpen,
    };
    if (!triggerProps.iconAfter && !triggerProps.iconBefore) {
      triggerProps.iconAfter = <ExpandIcon size="medium" label="" />;
    }
    return (
      <Button {...defaultButtonProps} {...triggerProps}>
        {insideTriggerContent}
      </Button>
    );
  }

  open = (attrs: OpenCloseArgs) => {
    this.sourceOfIsOpen = attrs.source;
    this.props.onOpenChange({ isOpen: true, event: attrs.event });
  }

  close = (attrs: OpenCloseArgs) => {
    this.sourceOfIsOpen = null;
    this.props.onOpenChange({ isOpen: false, event: attrs.event });
  }

  toggle = (attrs: OpenCloseArgs) => {
    if (attrs.source === 'keydown') return;

    if (this.props.isOpen) {
      this.close(attrs);
    } else {
      this.open(attrs);
    }
  }

  handleItemClicked = (event: MouseEvent | KeyboardEvent) => {
    this.props.onOpenChange({ isOpen: false, event });
  }

  renderTrigger = () => {
    const triggerContent = this.triggerContent();
    return this.isUsingDeprecatedAPI() ? triggerContent : (
      <div ref={(ref) => { this.triggerContainer = ref; }}>
        {triggerContent}
      </div>
    );
  };

  renderItems = (items: DeprecatedItem[]) => items.map((item: DeprecatedItem, itemIndex: number) =>
    <Item
      {...item}
      key={itemIndex}
      onActivate={({ event }) => {
        this.props.onItemActivated({ item, event });
      }}
    >
      {item.content}
    </Item>
  )

  renderGroups = (groups: DeprecatedItemGroup[]) => groups.map((group, groupIndex) =>
    <Group heading={group.heading} elemAfter={group.elemAfter} key={groupIndex}>
      {this.renderItems(group.items)}
    </Group>
  )

  renderDeprecated = () => {
    const { items, shouldFitContainer } = this.props;
    const { id } = this.state;

    return (
      <div
        id={id}
        ref={(ref) => {
          this.domMenuContainer = ref;
          this.domItemsList = ref
            ? ref.querySelectorAll('[data-role="droplistItem"]')
            : null;
        }}
        role="menu"
        style={shouldFitContainer ? null : { maxWidth: 300 }}
      >
        {this.renderGroups(items)}
      </div>
    );
  }

  render() {
    const {
      appearance, boundariesElement, children, isLoading, isOpen, onOpenChange, position,
      shouldAllowMultilineItems, shouldFitContainer, shouldFlip,
    } = this.props;
    const { id } = this.state;
    const isDeprecated = this.isUsingDeprecatedAPI();

    const deprecatedProps = isDeprecated ? {
      onKeyDown: this.handleKeyboardInteractionsDeprecated,
      shouldAllowMultilineItems,
    } : {
      onKeyDown: this.handleKeyboardInteractionForClosed,
    };

    return (
      <DropdownItemSelectionCache>
        <Droplist
          appearance={appearance}
          boundariesElement={boundariesElement}
          isLoading={isLoading}
          isOpen={isOpen}
          onClick={this.handleClick}
          onOpenChange={onOpenChange}
          position={position}
          shouldFitContainer={shouldFitContainer}
          shouldFlip={shouldFlip}
          trigger={this.renderTrigger()}
          {...deprecatedProps}
        >
          {
            isDeprecated ? this.renderDeprecated() : (
              <WidthConstrainer
                id={id}
                role="menu"
                shouldFitContainer={shouldFitContainer}
              >
                <DropdownItemClickManager onItemClicked={this.handleItemClicked}>
                  <DropdownItemFocusManager autoFocus={this.sourceOfIsOpen === 'keydown'}>
                    {children}
                  </DropdownItemFocusManager>
                </DropdownItemClickManager>
              </WidthConstrainer>
            )
          }
        </Droplist>
      </DropdownItemSelectionCache>
    );
  }
}
