// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import Button from '@atlaskit/button';

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

export const RightButtons: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  pointer-events: auto;
  right: 16px;
  height: 48px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightButton: ComponentClass<any> = styled(Button)`
  margin-left: 4px;
`;
