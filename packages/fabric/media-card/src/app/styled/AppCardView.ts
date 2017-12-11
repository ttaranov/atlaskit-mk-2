/* tslint:disable:variable-name */
import styled, { css } from 'styled-components';
import {
  akGridSizeUnitless,
  akFontFamily,
  akColorN0,
  akColorN20,
  akColorN800,
  akColorN900,
} from '@atlaskit/util-shared-styles';
import { colorWithAlpha } from '../../utils/colorWithAlpha';
import { borderRadius, cardShadow } from '../../styles';

const previewWidth = 116;

export interface CardProps {
  background: string | undefined;
}

const positionedBehindCard = `
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  content: '';
  border-radius: 3px;
`;

const cardColors = ({ background }: CardProps) => {
  if (background) {
    return css`
      color: ${akColorN0};
    `;
  } else {
    return css`
      color: ${akColorN800};
      background-color: ${akColorN20};
    `;
  }
};

const cardOverlay = ({ background }: CardProps) => {
  if (background) {
    return css`
      /* allow us to position the background underlay when we have a background */
      position: relative;
      z-index: 0;

      &::before {
        ${positionedBehindCard} background-color: ${akColorN20};
        background-image: url(${background});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
      &::after {
        ${positionedBehindCard} background-color: ${colorWithAlpha(
            akColorN900,
            0.5,
          )};
      }
    `;
  } else {
    return '';
  }
};

export const Card = styled.div`
  ${cardColors} ${cardOverlay} display: inline-flex; /* make the card fit to its contents */
  flex-direction: row; /* make the preview and content side-by-side */

  min-width: 368px;
  max-width: 100%; /* make the card fit its container */

  font-size: 12px;
  font-family: ${akFontFamily};

  ${borderRadius} ${cardShadow};
`;

export const Preview = styled.div`
  width: ${previewWidth}px; /* fixed px the design asks for */
  background-image: url(${({ image }: { image: string }) => image});
  background-size: cover;
  flex-shrink: 0;
`;

export interface CardContentProps {
  hasPreview?: boolean;
}

export const CardContent = styled.div`
  flex-grow: 1;
  max-width: ${({ hasPreview }: CardContentProps) =>
    (hasPreview && css`calc(100% - ${previewWidth}px)`) || '100%'};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: ${akGridSizeUnitless * 3}px;
  margin: 0 ${akGridSizeUnitless}px 12px ${akGridSizeUnitless * 2}px;
`;
