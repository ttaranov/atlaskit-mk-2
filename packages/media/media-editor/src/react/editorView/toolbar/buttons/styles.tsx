// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorB400,
  akColorN0,
  akColorN500,
} from '@atlaskit/util-shared-styles';

const optionsColorNormal = akColorN500;
const optionsColorActive = akColorB400;
const colorSampleOutlineColor = 'rgba(255, 255, 255, 0.5)';

export const ToolbarButton: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: pointer;
  position: relative; /* for the child OptionsAreaBase which uses absolute positioning */
  min-width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-left: 4px;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ActiveToolbarButton: ComponentClass<HTMLAttributes<{}>> = styled(
  ToolbarButton,
)`
  background-color: ${akColorN500};
  color: ${akColorN0};
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
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  border-color: ${colorSampleOutlineColor};
  box-sizing: border-box;
`;

export const DropdownIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  margin-right: -4px;
  margin-left: 4px;
`;
