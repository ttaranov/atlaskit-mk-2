// @flow
import React, { PureComponent, type Element as ReactElement } from 'react';
import styled from 'styled-components';

const positionStyles = {
  'top left': { left: 0, bottom: 0 },
  'top right': { right: 0, bottom: 0 },
  'right top': { left: 0, top: 0 },
  'right bottom': { left: 0, bottom: 0 },
  'bottom right': { right: 0, top: 0 },
  'bottom left': { left: 0, top: 0 },
  'left bottom': { right: 0, bottom: 0 },
  'left top': { right: 0, top: 0 },
};

const ContainerRelative = styled.div`
  position: relative;
`;

const ContainerDirection = styled.div`
  position: absolute;
  ${props => positionStyles[props.position]};
`;

type Props = {
  children: ReactElement<*>,
  position: string,
};

export default class DirectionWrapper extends PureComponent<Props> {
  static defaultProps = {
    position: 'top left',
  };

  render() {
    return (
      <ContainerRelative>
        <ContainerDirection position={this.props.position}>
          {this.props.children}
        </ContainerDirection>
      </ContainerRelative>
    );
  }
}
