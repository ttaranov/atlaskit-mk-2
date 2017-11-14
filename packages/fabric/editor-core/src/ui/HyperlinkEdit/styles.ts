import { akColorN10, akColorN30 } from '@atlaskit/util-shared-styles';
import FloatingToolbarDefault from '../FloatingToolbar';
import ToolbarButtonDefault from '../ToolbarButton';
import styled from 'styled-components';
import { ComponentClass } from 'react';

// tslint:disable-next-line:variable-name
export const FloatingToolbar: ComponentClass<any> = styled(FloatingToolbarDefault)`
  background-color: ${akColorN10};
  padding: 4px 8px 4px 4px;
  min-height: 24px;
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
export const Container = styled.div`
  display: flex;
  align-items: center;
  > div {
    display: inline;
    height: 24px;
  }
`;

// tslint:disable-next-line:variable-name
export const ToolbarButton: ComponentClass<any> = styled(ToolbarButtonDefault)`
  margin-left: 4px;
`;
