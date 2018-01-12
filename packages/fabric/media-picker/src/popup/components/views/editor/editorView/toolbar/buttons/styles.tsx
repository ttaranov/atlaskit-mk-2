// tslint:disable:variable-name
import {
  akColorB50,
  akColorN0,
  akColorN500,
} from '@atlaskit/util-shared-styles';
import * as InlineSvg from 'svg-inline-react';
import styled from 'styled-components';

const transparent = 'rgba(0, 0, 0, 0)';
const buttonHoverBackgroundColor = 'rgba(255, 255, 255, 0.15)';
const buttonClickedBackgroundColor = 'rgba(76, 154, 255, 0.25)';
const optionsColorNormal = 'rgba(255, 255, 255, 0.6)';
const optionsColorActive = 'rgba(66, 82, 110, 0.6)';
const colorSampleOutlineColor = 'rgba(255, 255, 255, 0.5)';

const ButtonBase = styled.div`
  cursor: pointer;
  position: relative; // for the child OptionsAreaBase which uses absolute positioning
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

const OptionsAreaBase = styled(InlineSvg)`
  position: absolute;
  width: 4px;
  height: 4px;
  right: 4px;
  bottom: 4px;

  svg {
    transform: translateY(-9px);
  }
`;

export interface OptionsProps {
  src: string;
}

export const OptionsAreaNormal = styled(OptionsAreaBase)`
  ${(props: OptionsProps) => ''} color: ${optionsColorNormal};
`;

export const OptionsAreaActive = styled(OptionsAreaBase)`
  ${(props: OptionsProps) => ''} color: ${optionsColorActive};
`;

export const ColorSample = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colorSampleOutlineColor};
`;

export interface LineWidthIconProps {
  src: string;
}

export const LineWidthIcon = styled(InlineSvg)`
  ${(props: LineWidthIconProps) => ''} width: 18px;
  height: 16px;
`;
