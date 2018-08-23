// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import Button from '@atlaskit/button';
import { akColorN30A } from '@atlaskit/util-shared-styles';

export const ToolbarContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 64px;
`;

export const CenterButtons: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: pointer;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const VerticalLine: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 1px;
  background: ${akColorN30A};
  height: 32px;
  margin: 0 8px;
`;
