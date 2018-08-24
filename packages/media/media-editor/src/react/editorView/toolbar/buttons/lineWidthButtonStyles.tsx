// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorB50,
  akColorB400,
  akColorN0,
  akColorN30,
  akColorN50,
  akColorN500,
} from '@atlaskit/util-shared-styles';

export interface AreaProps {
  isActive: boolean;
}

export const MainArea: ComponentClass<
  HTMLAttributes<{}> & AreaProps
> = styled.div`
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border-radius: 15px;
  background-color: ${(props: AreaProps) =>
    props.isActive ? akColorN500 : akColorN30};
`;

export const FrontArea: ComponentClass<
  HTMLAttributes<{}> & AreaProps
> = styled.div`
  box-sizing: border-box;
  background-color: ${(props: AreaProps) =>
    props.isActive ? akColorN0 : akColorN500};
`;
