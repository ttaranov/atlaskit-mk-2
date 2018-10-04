// @flow
import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Top = styled.div`
  flex: 0 0 ${({ top }) => top}px;
  width: ${({ width }) => width}px;
  background: rgba(9, 30, 66, 0.54);
  pointer-events: auto;
`;

const Bottom = styled.div`
  flex: 0 0 calc(100% - ${({ bottom }) => bottom}px);
  width: ${({ width }) => width}px;
  background: rgba(9, 30, 66, 0.54);
  pointer-events: auto;
`;

const Left = styled.div`
  width: ${({ width }) => width}px;
  flex: 0 0 100%;
  background: rgba(9, 30, 66, 0.54);
  pointer-events: auto;
`;

const Right = styled.div`
  flex: 0 0 100%;
  background: rgba(9, 30, 66, 0.54);
  width: calc(100% - ${({ right }) => right}px);
  pointer-events: auto;
`;

type Props = {
  bottom: number,
  left: number,
  right: number,
  top: number,
  width: number,
  height: number,
  radius: number,
};

export default class WindowedBlanket extends Component<Props> {
  render() {
    const { left, right, top, bottom, height, width, radius } = this.props;
    return (
      <Container>
        {left > 0 && <Left width={left} />}
        {top > 0 && <Top top={top} width={width} />}
        <svg height={height} width={width}>
          <path
            fill={colors.N100A}
            fillRule="evenodd"
            d={`M 0,0 H ${width} V ${height} H ${-width} z M 0,${radius} V ${height -
              radius} a${radius},${radius} 0 0 0 ${radius},${radius} H ${width -
              radius} a${radius},${radius} 0 0 0 ${radius},${-radius} V ${radius} a${radius},${radius} 0 0 0 ${-radius},${-radius} H ${radius} a${radius},${radius} 0 0 0 ${-radius},${radius} z`}
          />
        </svg>
        {bottom > 0 && <Bottom width={width} bottom={bottom} />}
        {right > 0 && <Right right={right} />}
      </Container>
    );
  }
}
