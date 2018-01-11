// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { akColorB400, akColorN40 } from '@atlaskit/util-shared-styles';

import getDisplayName from '../../util/getDisplayName';
import safeContextCall from '../../util/safeContextCall';
import { selectionManagerContext } from '../../util/contextNamespace';
import type { ReactElement, Behaviors } from '../../types';

import { KEY_ENTER, KEY_SPACE } from '../../util/keys';

// HOC that typically wraps @atlaskit/item
const withToggleInteraction = (
  WrappedComponent: ReactElement,
  SelectionIcon: ReactElement,
  ariaRole: Behaviors
) => {
  class WithToggleInteraction extends Component {
    static propTypes = {
      /** Content to be displayed inside the item. Same as @atlaskit/item `children` prop. */
      children: PropTypes.node,
      /** Unique identifier for the item, so that selection state can be tracked when the dropdown
        * is opened/closed. */
      id: PropTypes.string.isRequired,
      /** Set at mount to make the item appear checked. The user may interact with the
       * item after mount. See isSelected if you want to control the item state manually. */
      defaultSelected: PropTypes.bool,
      /** Causes the item to appear visually checked. Can be set at mount time, and updated after
        * mount. Changing the value will not cause onClick to be called. */
      isSelected: PropTypes.bool,
      /** Standard optional onClick handler */
      onClick: PropTypes.func,
    }

    static defaultProps = {
      onClick: () => {},
    }

    static contextTypes = {
      [selectionManagerContext]: PropTypes.object.isRequired,
    };

    componentDidMount() {
      const { defaultSelected, isSelected, id } = this.props;
      this.warnIfUseControlledAndUncontrolledState();

      this.callContextFn('setItemSelected', id, isSelected, defaultSelected);
    }

    componentWillReceiveProps(nextProps: Object) {
      const { id, defaultSelected, isSelected } = nextProps;
      if (this.props.isSelected !== isSelected) {
        this.callContextFn('setItemSelected', id, isSelected, defaultSelected);
      }
    }

    getIconColors = (isSelected: boolean = false) => {
      if (isSelected) {
        return { primary: akColorB400, secondary: akColorN40 };
      }
      return { primary: akColorN40, secondary: akColorN40 };
    }

    warnIfUseControlledAndUncontrolledState = () => {
      if (process.env.NODE_ENV !== 'production') {
        if (this.props.defaultSelected && this.props.isSelected) {
          // eslint-disable-next-line no-console
          console.warn('DropdownItem defaultSelected and isSelected props should not be used at the same time.');
        }
      }
    }

    callContextFn = safeContextCall(this, selectionManagerContext)

    handleKeyboard = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === KEY_ENTER || key === KEY_SPACE) {
        // We prevent default here to avoid page scroll
        event.preventDefault();

        this.handleItemActivated(event);
      }
    }

    handleItemActivated = (event: Event) => {
      this.props.onClick(event);
      this.callContextFn('itemClicked', this.props.id);
    }

    isSelectedInDropdown = () => (
      this.callContextFn('isItemSelected', this.props.id)
    )

    render() {
      const { children, ...otherProps } = this.props;
      const isSelected = this.isSelectedInDropdown();
      const iconColors = this.getIconColors(isSelected);

      return (
        <WrappedComponent
          {...otherProps}
          role={ariaRole}
          aria-checked={isSelected}
          isSelected={isSelected}
          onClick={this.handleItemActivated}
          onKeyDown={this.handleKeyboard}
          elemBefore={
            <SelectionIcon
              primaryColor={iconColors.primary}
              secondaryColor={iconColors.secondary}
              size="medium"
              label=""
            />
          }
        >
          {children}
        </WrappedComponent>
      );
    }
  }
  WithToggleInteraction.displayName = `WithToggleInteraction(${getDisplayName(WrappedComponent)})`;
  return WithToggleInteraction;
};

export default withToggleInteraction;
