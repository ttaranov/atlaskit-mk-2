// @flow
import React, { Component, type Element, type ChildrenArray } from 'react';
import Header from './Header';
import { HeadersContainer } from '../styled';

type Props = {
  children: ChildrenArray<Element<typeof Header>>,
};

export default class Headers extends Component<Props> {
  render() {
    return (
      <HeadersContainer role={'row'}>
        {React.Children.map(this.props.children, (header, index) =>
          React.cloneElement(header, { key: index, columnIndex: index }),
        )}
      </HeadersContainer>
    );
  }
}
