/* tslint:disable:variable-name */
import styled from 'styled-components';
import Button from '@atlaskit/button';

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

export const InsertButton = styled(Button)`
  float: right;
  margin-right: 4px;
` as any;

export const CancelButton = styled(Button as any)`
  float: right;
` as any;
