import { akColorN10, akColorN30, akColorR400 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';
import { ComponentClass } from 'react';
import ToolbarButtonDefault from '../ToolbarButton';
import FloatingToolbarDefault from '../FloatingToolbar';

// tslint:disable-next-line:variable-name
export const FloatingToolbar: ComponentClass<any> = styled(FloatingToolbarDefault)`
  background-color: ${akColorN10};
  padding: 4px 8px;
  height: 24px;
`;

// tslint:disable-next-line:variable-name
export const TrashToolbarButton: ComponentClass<any> = styled(ToolbarButtonDefault)`
  &:hover {
    color: ${akColorR400};
  }
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;
