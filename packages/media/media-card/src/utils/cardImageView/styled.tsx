/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN20 } from '@atlaskit/util-shared-styles';
import { Root, cardShadow, centerSelf, borderRadius, size } from '../../styles';

export const Wrapper = styled(Root)`
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
