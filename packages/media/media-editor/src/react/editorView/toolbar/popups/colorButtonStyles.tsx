// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN0, akBorderRadius } from '@atlaskit/util-shared-styles';

export const ColorSample: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin: 4px;
  border-radius: ${akBorderRadius};
`;

export const CheckArea: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${akColorN0};
`;
