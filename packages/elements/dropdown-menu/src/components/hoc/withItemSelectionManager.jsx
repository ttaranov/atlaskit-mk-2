// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getDisplayName from '../../util/getDisplayName';
import DropdownItemSelectionManager from '../context/DropdownItemSelectionManager';
import type { Behaviors } from '../../types';

// HOC that typically wraps @atlaskit/item/ItemGroup

const withDropdownItemSelectionManager = (WrappedComponent: any, selectionBehavior: Behaviors) => (
  class WithDropdownItemSelectionManager extends Component {
    static displayName = `WithDropdownItemSelectionManager(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      children: PropTypes.node,
      id: PropTypes.string.isRequired,
    }

    render() {
      const { children, id, ...otherProps } = this.props;

      return (
        <WrappedComponent {...otherProps}>
          <DropdownItemSelectionManager groupId={id} behavior={selectionBehavior}>
            {children}
          </DropdownItemSelectionManager>
        </WrappedComponent>
      );
    }
  }
);

export default withDropdownItemSelectionManager;
