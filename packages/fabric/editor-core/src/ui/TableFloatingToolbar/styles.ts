// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

export const TriggerWrapper = styled.div`
  display: flex;
`;

export const ExpandIconWrapper = styled.span`
  margin-left: -8px;
`;

export const Wrapper = styled.span`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

export const Spacer = styled.span`
  display: flex;
  flex: 1;
  padding: 12px;
`;
