/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { borderRadius } from '../../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  ${borderRadius} background-color: ${akColorN30};
`;
