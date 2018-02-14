// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN80 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Toolbar = styled.div`
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  padding: 3px 6px;
  display: flex;
  align-content: center;
  & * {
    display: flex;
  }
`;
// tslint:disable-next-line:variable-name
export const AdvanceMenuItemWrap = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 110px;
`;
// tslint:disable-next-line:variable-name
export const AdvanceMenuItemAfter = styled.span`
  color: ${akColorN80};
  font-size: 80%;
`;
