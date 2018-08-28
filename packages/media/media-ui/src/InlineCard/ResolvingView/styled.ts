import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: inline-flex;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 3px;
`;
