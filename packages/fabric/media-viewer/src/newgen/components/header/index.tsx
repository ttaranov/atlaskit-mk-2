import * as React from 'react';
import { Component } from 'react';
import { MediaViewerItem } from '../../domain';
import { Wrapper } from './styled';

export interface HeaderState {}

export interface HeaderProps {
  item: MediaViewerItem;
}

export class Header extends Component<HeaderProps, HeaderState> {
  render() {
    const {item} = this.props;
    return (
      <Wrapper>
        this is the header: &nbsp;
        <strong>
          {item.identifier.id}
        </strong>
      </Wrapper>
    );
  }
}
