// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN20, akColorN800 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 32px 8px 12px;
  color: ${akColorN800};
  > span {
    display: flex;
    margin-right: 8px;
  }
  &:hover {
    background-color: ${akColorN20};
  }
`;
