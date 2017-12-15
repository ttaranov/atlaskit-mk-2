/* tslint:disable:variable-name */
import styled from 'styled-components';
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
      ${size()}
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
