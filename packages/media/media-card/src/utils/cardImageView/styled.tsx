/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN20 } from '@atlaskit/util-shared-styles';
import { Root, cardShadow, centerSelf, borderRadius, size } from '../../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled(Root)`
  ${cardShadow} ${borderRadius} background: #fff;
  cursor: pointer;
  line-height: normal;
  position: relative;
  ${size()} .wrapper {
    ${borderRadius} background: ${akColorN20};
    display: block;
    height: inherit;
    position: relative;

    .img-wrapper {
      ${borderRadius} position: relative;
      width: inherit;
      height: inherit;
      display: block;

      img {
        ${centerSelf} max-height: 100%;
        max-width: 100%;
        display: block;
      }
    }
  }
`;
