// tslint:disable:variable-name
import {
  akColorN0,
  akColorN70,
  akColorN900,
} from '@atlaskit/util-shared-styles';
import Button from '@atlaskit/button';
import styled from 'styled-components';

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

export const ErrorIcon = styled.img`
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
