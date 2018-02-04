// @flow
import React, { Component } from 'react';

import { Icon, Paragraph } from '@atlaskit/skeleton';

import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import ContainerItemWrapper from '../../styled/skeleton/ContainerItemWrapper';
import ContainerItemText from '../../styled/skeleton/ContainerItemText';

type Props = {
  isCollapsed: boolean,
};

export default class ContainerItem extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };
  render() {
    return (
      <ContainerItemWrapper>
        <Icon />
        <HiddenWhenCollapsed isCollapsed={this.props.isCollapsed}>
          <ContainerItemText>
            <Paragraph />
          </ContainerItemText>
        </HiddenWhenCollapsed>
      </ContainerItemWrapper>
    );
  }
}
