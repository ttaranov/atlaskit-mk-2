// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN0, akColorN50 } from '@atlaskit/util-shared-styles';

export const Container: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

export const HoverArea: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 1px;
  border-radius: 4px;

  &:hover {
    background-color: ${akColorN50};
  }
`;

export const MainArea: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  margin: 2px;
  border-radius: 2px;
  background-color: ${akColorN0};
`;

export const ColorSample: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  margin: 1px;
  border-radius: 2px;
`;

export const CheckArea: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${akColorN0};
`;
