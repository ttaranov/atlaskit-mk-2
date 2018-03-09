// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import Button from '@atlaskit/button';

export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  height: 80px;
  padding: 26px 15px 23px 18px;
`;

export const InsertButton = styled(Button)`
  margin-right: 5px;
` as any;

export const CancelButton = styled(Button)`` as any;
