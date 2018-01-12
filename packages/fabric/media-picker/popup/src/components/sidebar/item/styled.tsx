/* tslint:disable:variable-name */
import styled from 'styled-components';
import { akColorN500, akColorB400 } from '@atlaskit/util-shared-styles';

export interface WrapperProps {
  isActive: boolean;
}

export const Wrapper = styled.li`
  color: ${({ isActive }: WrapperProps) =>
    isActive ? akColorB400 : akColorN500};
  padding: 6px 25px;
  list-style-type: none;
  cursor: pointer;
  opacity: 1;
`;

export const ServiceIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const ServiceName = styled.div`
  font-size: 14px;
  position: relative;
  margin-left: 10px;
  top: -1px;
  display: inline-block;
`;
