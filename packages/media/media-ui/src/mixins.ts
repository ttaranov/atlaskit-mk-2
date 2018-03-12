// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import { css, StyledComponentClass, Styles, keyframes } from 'styled-components';
import {
  akColorN900,
  akColorN300,
  akBorderRadius,
} from '@atlaskit/util-shared-styles';

export const cardTitle = css`
  color: ${akColorN900};
  font-size: 16px;
  font-weight: 500;
  line-height: ${20 / 16};
`;

export const cardDescription = css`
  color: ${akColorN300};
  font-size: 12px;
  line-height: ${16 / 12};
`;

export const ellipsis = (maxWidth: string | number = '100%') => {
  const unit = typeof maxWidth === 'number' ? 'px' : '';

  return `
    max-width: ${maxWidth}${unit};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
};

export const size = (value: string | number = '100%') => {
  const unit = typeof value === 'number' ? 'px' : '';

  return `
    width: ${value}${unit};
    height: ${value}${unit};
  `;
};

export const center = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const absolute = (top = 0, left = 0) => `
  position: absolute;
  top: ${top}px;
  left: ${left}px;
`;

export const borderRadius = `
  border-radius: ${akBorderRadius};
`;

export const borderRadiusBottom = `
  border-bottom-left-radius: ${akBorderRadius};
  border-bottom-right-radius: ${akBorderRadius};
`;

export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

export const fadeInKeyframe = keyframes`
  0%{
    opacity: 0;
  }

  100%{
    opacity: 1;
  }
`;

export const fadeIn = `
  animation: ${fadeInKeyframe} .3s ${easeInOutCubic};
`;
