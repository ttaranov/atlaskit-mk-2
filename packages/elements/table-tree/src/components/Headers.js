// @flow
import React, { PureComponent, type Element, type ChildrenArray } from 'react';
import Header from './Header';
import { TreeRowContainer } from '../styled';

type Props = {
  children: ChildrenArray<Element<typeof Header>>,
};

export default class Headers extends PureComponent<Props> {
  render() {
    return (
      <TreeRowContainer role={'row'}>
        {React.Children.map(this.props.children, (header, index) =>
          React.cloneElement(header, { key: index, columnIndex: index }),
        )}
      </TreeRowContainer>
    );
  }
}
