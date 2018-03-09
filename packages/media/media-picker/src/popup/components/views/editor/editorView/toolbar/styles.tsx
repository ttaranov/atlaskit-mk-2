// tslint:disable:variable-name
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import Button from '@atlaskit/button';
import { akColorN700A } from '@atlaskit/util-shared-styles';

const transparent = 'rgba(0, 0, 0, 0)';

export const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  pointer-events: none;
  width: 100%;
  bottom: 0;
  height: 64px;
  background: linear-gradient(to top, ${akColorN700A}, ${transparent});
`;

export const CenterButtons = styled.div`
  pointer-events: auto;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const RightButtons = styled.div`
  position: absolute;
  pointer-events: auto;
  right: 16px;
  height: 48px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightButton = styled(Button)`
  margin-left: 4px;
` as any;
