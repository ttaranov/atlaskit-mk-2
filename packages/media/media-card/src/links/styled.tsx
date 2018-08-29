/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorN20,
  akColorN30,
  akColorB50,
} from '@atlaskit/util-shared-styles';
import { CardAppearance } from '../index';
import { Root, withAppearance } from '../styles';
import { borderRadius } from '@atlaskit/media-ui';
import { getCSSBoundaries } from '../utils/cardDimensions';

export interface WrapperProps {
  appearance?: CardAppearance;
}

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled(Root)`
  ${borderRadius} ${({ appearance }: WrapperProps) =>
    getCSSBoundaries(appearance)} user-select: none;
  background-color: ${akColorN20};
  line-height: initial;
  padding: 0 8px 8px 8px;
  transition: background 0.3s;

  .link-wrapper:hover & {
    background-color: ${akColorN30};
  }

  .link-wrapper:active & {
    background-color: ${akColorB50};
  }

  ${withAppearance({
    square: `
      display: block;
      justify-content: flex-end;
    `,
    horizontal: `
      display: block;
    `,
  })};
`;
