/* tslint:disable:variable-name */
import styled from 'styled-components';
import Button, { Props } from '@atlaskit/button';

export const Wrapper = styled.div`
  box-sizing: border-box;
  float: left;
  width: 100%;
  font-size: 13px;
  display: table-row;
  height: 80px;
  padding: 26px 15px 23px 18px;
  z-index: 100;
`;

export const InsertButton = styled<Props>(Button)`
  float: right;
  margin-right: 4px;
`;

export const CancelButton = styled<Props>(Button)`
  float: right;
`;
