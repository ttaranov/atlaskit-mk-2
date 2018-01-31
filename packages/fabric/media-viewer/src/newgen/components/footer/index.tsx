import * as React from 'react';
import { Component } from 'react';
import { MediaViewerItem } from '../../domain';
import { Wrapper } from './styled';

export interface FooterState {}

export interface FooterProps {
  item: MediaViewerItem;
}

export class Footer extends Component<FooterProps, FooterState> {
  render() {
    const {item} = this.props;
    return (
      <Wrapper>
        I am the footer: &nbsp;
        <strong>
          {item.identifier.id}
        </strong>
      </Wrapper>
    );
  }
}
