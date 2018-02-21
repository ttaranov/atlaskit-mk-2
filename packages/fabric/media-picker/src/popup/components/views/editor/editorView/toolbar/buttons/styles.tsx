// tslint:disable:variable-name
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorB50,
  akColorN0,
  akColorN500,
} from '@atlaskit/util-shared-styles';

const transparent = 'rgba(0, 0, 0, 0)';
const buttonHoverBackgroundColor = 'rgba(255, 255, 255, 0.15)';
const buttonClickedBackgroundColor = 'rgba(76, 154, 255, 0.25)';
const optionsColorNormal = 'rgba(255, 255, 255, 0.6)';
const optionsColorActive = 'rgba(66, 82, 110, 0.6)';
const colorSampleOutlineColor = 'rgba(255, 255, 255, 0.5)';

const ButtonBase = styled.div`
  cursor: pointer;
  position: relative; /* for the child OptionsAreaBase which uses absolute positioning */
  background-color: ${transparent};
  color: ${akColorN0};
  width: 40px;
  height: 32px;
  border-radius: 4px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonNormal = styled(ButtonBase)`
  &:hover {
    background-color: ${buttonHoverBackgroundColor};
    color: ${akColorN0};
  }
`;

export const ButtonClicked = styled(ButtonBase)`
  background-color: ${buttonClickedBackgroundColor};
  color: ${akColorB50};
`;

export const ButtonActive = styled(ButtonBase)`
  background-color: ${akColorN0};
  color: ${akColorN500};
`;

export interface OptionsIconWrapperProps {
  isActive: boolean;
}

export const OptionsIconWrapper = styled.div`
  position: absolute;
  right: -7px;
  bottom: -10px;

  color: ${({ isActive }: OptionsIconWrapperProps) =>
    isActive ? optionsColorActive : optionsColorNormal};
`;

export const ColorSample = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colorSampleOutlineColor};
`;
