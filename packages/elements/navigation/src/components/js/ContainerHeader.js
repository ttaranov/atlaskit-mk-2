import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ContainerHeaderWrapper from '../styled/ContainerHeaderWrapper';
import { globalItemSizes } from '../../shared-variables';

export default class ContainerHeader extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    iconOffset: PropTypes.number,
    isFullWidth: PropTypes.bool,
    isInDrawer: PropTypes.bool,
  }
  static defaultProps = {
    iconOffset: globalItemSizes.medium,
    isInDrawer: false,
  }

  render() {
    const {
      iconOffset,
      isFullWidth,
      isInDrawer,
    } = this.props;
    return (
      <ContainerHeaderWrapper
        isInDrawer={isInDrawer}
        iconOffset={iconOffset}
        isFullWidth={isFullWidth}
      >
        {this.props.children}
      </ContainerHeaderWrapper>
    );
  }
}
