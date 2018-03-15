// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
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

const ButtonBase: ComponentClass<HTMLAttributes<{}>> = styled.div`
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

export const ButtonNormal: ComponentClass<HTMLAttributes<{}>> = styled(
  ButtonBase,
)`
  &:hover {
    background-color: ${buttonHoverBackgroundColor};
    color: ${akColorN0};
  }
`;

export const ButtonClicked: ComponentClass<HTMLAttributes<{}>> = styled(
  ButtonBase,
)`
  background-color: ${buttonClickedBackgroundColor};
  color: ${akColorB50};
`;

export const ButtonActive: ComponentClass<HTMLAttributes<{}>> = styled(
  ButtonBase,
)`
  background-color: ${akColorN0};
  color: ${akColorN500};
`;

export interface OptionsIconWrapperProps {
  isActive: boolean;
}

export const OptionsIconWrapper: ComponentClass<
  HTMLAttributes<{}> & OptionsIconWrapperProps
> = styled.div`
  position: absolute;
  right: -7px;
  bottom: -10px;

  color: ${({ isActive }: OptionsIconWrapperProps) =>
    isActive ? optionsColorActive : optionsColorNormal};
`;

export const ColorSample: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colorSampleOutlineColor};
`;
