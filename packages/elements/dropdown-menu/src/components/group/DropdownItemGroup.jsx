// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemGroup } from '@atlaskit/item';

export default class DropdownItemGroup extends Component {
  static propTypes = {
    /** DropdownItems to be rendered inside the group.*/
    children: PropTypes.node,
    /** Optional heading text to be shown above the items. */
    title: PropTypes.string,
    /** Content to be shown to the right of the title heading. Not shown if no title is set. */
    elemAfter: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  }

  render() {
    const { children, elemAfter, title } = this.props;
    return (
      <ItemGroup
        elemAfter={elemAfter}
        title={title}
        role="menu"
      >{children}</ItemGroup>
    );
  }
}
