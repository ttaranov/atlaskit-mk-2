// @flow
import React, { Component } from 'react';

import { Avatar, Paragraph } from '@atlaskit/skeleton';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import ContainerItemText from '../../styled/skeleton/ContainerItemText';
import DefaultContainerHeaderInner from '../../styled/skeleton/DefaultContainerHeaderInner';

export type Props = {
  isCollapsed: boolean,
};

export default class DefaultContainerHeader extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <DefaultContainerHeaderInner>
        <Avatar appearance="square" size="large" weight="strong" />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <ContainerItemText>
            <Paragraph weight="strong" />
          </ContainerItemText>
        </HiddenWhenCollapsed>
      </DefaultContainerHeaderInner>
    );
  }
}
