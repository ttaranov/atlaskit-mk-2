/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass, ImgHTMLAttributes } from 'react';
import { akColorN300 } from '@atlaskit/util-shared-styles';
import { size, center, absolute } from '../mixins';
import { newCardDetailsHeight } from '../newCardDetailsHeight';

// This preserves the 16:9 aspect ratio
const aspectRatio = `
  height: 0;
  padding-bottom: 56.25%;
`;

export interface WithPreviewProps {
  hasPreview: boolean;
}

const withPreview = (
  withPreviewStyles: string,
  withoutPreviewStyles: string = '',
) => ({ hasPreview }: WithPreviewProps) => {
  return hasPreview ? withPreviewStyles : withoutPreviewStyles;
};

export const ErrorWrapper: ComponentClass<
  HTMLAttributes<{}> & WithPreviewProps
> = styled.div`
  /* Needed to keep error state consistent */
  padding-top: ${newCardDetailsHeight}px;
  position: relative;
  ${withPreview(
    `
      ${aspectRatio}
    `,
    `
      ${center}
    `,
  )};
`;

export const ErrorContainer: ComponentClass<
  HTMLAttributes<{}> & WithPreviewProps
> = styled.div`
  color: ${akColorN300};
  display: flex;
  align-items: center;
  ${absolute()} ${size()} ${withPreview(
  `
      flex-direction: column;
      justify-content: center;
    `,
  `
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
    `,
)};
`;

export const ErrorMessage: ComponentClass<
  HTMLAttributes<{}> & WithPreviewProps
> = styled.div`
  ${withPreview(
    `
    margin: 16px 0 24px 0;
    `,
  )};
`;

export const ErrorImage: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  height: 94px;
`;
