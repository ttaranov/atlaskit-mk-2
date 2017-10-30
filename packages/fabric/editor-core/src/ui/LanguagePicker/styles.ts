import { akColorN10, akColorN30, akColorR400, akBorderRadius } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';
import FloatingToolbarDefault from '../FloatingToolbar';
import ToolbarButtonDefault from '../ToolbarButton';
import { ComponentClass } from 'react';

// tslint:disable-next-line:variable-name
export const FloatingToolbar: ComponentClass<any> = styled(FloatingToolbarDefault)`
  background-color: transparent;
  > div {
    border-radius: ${akBorderRadius};
    background-color: ${akColorN10};
    display: flex;
    alignItems: center;
    padding: 4px 8px;
  }
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 20px;
  display: inline-block;
  margin: 0 8px;
`;

// tslint:disable-next-line:variable-name
export const TrashToolbarButton: ComponentClass<any> = styled(ToolbarButtonDefault)`
  &:hover {
    color: ${akColorR400};
  }
`;
