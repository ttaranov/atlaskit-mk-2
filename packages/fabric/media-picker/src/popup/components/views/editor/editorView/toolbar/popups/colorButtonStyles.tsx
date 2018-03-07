// tslint:disable:variable-name
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN0, akColorN50 } from '@atlaskit/util-shared-styles';

export const Container = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

export const HoverArea = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 1px;
  border-radius: 4px;

  &:hover {
    background-color: ${akColorN50};
  }
`;

export const MainArea = styled.div`
  position: absolute;
  width: 26px;
  height: 26px;
  margin: 2px;
  border-radius: 2px;
  background-color: ${akColorN0};
`;

export const ColorSample = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  margin: 1px;
  border-radius: 2px;
`;

export const CheckArea = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${akColorN0};
`;
