/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes, ImgHTMLAttributes } from 'react';
import { akColorN300 } from '@atlaskit/util-shared-styles';
import { withAppearance } from '../../styles';
import { size, center, absolute } from '../../styles';
import newCardDetailsHeight from '../../shared/newCardDetailsHeight';

// This preserves the 16:9 aspect ratio
const aspectRatio = `
  height: 0;
  padding-bottom: 56.25%;
`;

export const ErrorWrapper = styled.div`
  // Needed to keep error state consistent
  padding-top: ${newCardDetailsHeight}px;
  position: relative;
  ${withAppearance({
    square: `
      ${aspectRatio}
    `,
    horizontal: `
      ${center}
    `,
  })};
`;

export const ErrorContainer = styled.div`
  color: ${akColorN300};
  display: flex;
  align-items: center;
  ${absolute()} ${size()} ${withAppearance({
      horizontal: `
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
    `,
      square: `
      flex-direction: column;
      justify-content: center;
    `,
    })};
`;

export const ErrorMessage = styled.div`
  ${withAppearance({
    square: `
      margin: 16px 0 24px 0;
    `,
  })};
`;

export const ErrorImage = styled.img`
  height: 94px;
`;
