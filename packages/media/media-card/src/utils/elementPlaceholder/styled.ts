/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { borderRadius } from '@atlaskit/media-ui';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  ${borderRadius} background-color: ${akColorN30};
`;
