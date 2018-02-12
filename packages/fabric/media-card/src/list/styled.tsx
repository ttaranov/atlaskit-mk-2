/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
import styled, {
// @ts-ignore: unused variable
  StyledComponentClass,
  css,
  keyframes,
} from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { size } from '../styles';

const cardEntryAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%) scale(0.5);
    position: relative;
    z-index: 1;
    /*
      37px is a magic number that looks good. Its close to the height of a small card (42px),
      but seems to look good for the larger (104px) cards too
    */
    margin-top: -37px;
  }
  50% {
    margin-top: 0;
  }
  70% {
    transform: translateY(0) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    margin-top: 0;
  }
`;

export interface CardListItemWrapperProps {
  readonly key?: string;
  readonly cardWidth?: string | number;
  shouldAnimate?: boolean;
}

export const Spinner = styled.div`
  ${size(30)};
`;

export const CardListItemWrapper = styled.div`
  ${({ cardWidth }: CardListItemWrapperProps) => {
    if (cardWidth) {
      return css`
        width: ${getCSSUnitValue(cardWidth)};
      `;
    } else {
      return '';
    }
  }} margin-top: 5px;

  ${({ shouldAnimate }) =>
    (shouldAnimate &&
      `
    &.card-list-item-enter.card-list-item-enter-active {
      animation: ${cardEntryAnimation} 0.75s forwards;
    }
  `) ||
    ''};
`;
