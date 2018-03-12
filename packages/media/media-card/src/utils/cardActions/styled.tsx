/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN500 } from '@atlaskit/util-shared-styles';
import { borderRadius, size, center } from '@atlaskit/media-ui';
import { Root } from '../../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled(Root)`
  display: flex;
  position: relative;
  line-height: 0;
`;

export const CardActionButton: ComponentClass<
  HTMLAttributes<HTMLDivElement>
> = styled.div`
  ${center} ${borderRadius} ${size(26)} color: ${akColorN500};

  &:hover {
    cursor: pointer;
    background-color: rgba(9, 30, 66, 0.06);
  }
`;
