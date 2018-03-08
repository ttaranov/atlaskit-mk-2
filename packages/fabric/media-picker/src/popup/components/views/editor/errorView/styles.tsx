// tslint:disable:variable-name
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorN0,
  akColorN70,
  akColorN900,
} from '@atlaskit/util-shared-styles';
import Button from '@atlaskit/button';

export const ErrorPopup = styled.div`
  width: 290px;
  padding: 16px;
  background-color: ${akColorN0};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ErrorIconWrapper = styled.div`
  width: 92px;
`;

export const ErrorMessage = styled.div`
  color: ${akColorN900};
  margin-top: 16px;
  margin-bottom: 4px;
  width: 256px;
  text-align: center;
  font-weight: bold;
`;

export const ErrorHint = styled.div`
  color: ${akColorN70};
  margin-top: 4px;
  margin-bottom: 20px;
  width: 256px;
  text-align: center;
`;

export const ErrorButton = styled(Button)`
  display: inline-flex;
  width: 84px;
  margin: 2px;
  justify-content: center;
` as any;
