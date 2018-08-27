// @flow
import { css } from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import { ASC, DESC } from '../internal/constants';
import { arrow } from '../theme';

export const truncateStyle = ({
  width,
  isFixedSize,
  shouldTruncate,
}: {
  width: number,
  isFixedSize: boolean,
  shouldTruncate: boolean,
}) => css`
  ${width
    ? css`
        width: ${width}%;
      `
    : ''} ${isFixedSize
    ? css`
        overflow: hidden;
      `
    : ''};
  ${isFixedSize && shouldTruncate
    ? css`
        text-overflow: ellipsis;
        white-space: nowrap;
      `
    : ''};
`;

export const onClickStyle = ({ onClick }: { onClick: boolean }) =>
  onClick &&
  css`
    &:hover {
      cursor: pointer;
    }
  `;

export const arrowsStyle = (props: Object) => {
  const { isSortable, sortOrder } = props;

  if (!isSortable) return '';

  const pseudoBase = css`
    border: 3px solid transparent;
    display: block;
    height: 0;
    position: absolute;
    right: -${gridSize}px;
    width: 0;
  `;

  return css`
    & > span {
      position: relative;
      &::before {
        ${pseudoBase};
        border-bottom: 3px solid
          ${sortOrder === ASC
            ? arrow.selectedColor(props)
            : arrow.defaultColor(props)};
        bottom: 8px;
        content: ' ';
      }
      &::after {
        ${pseudoBase};
        border-top: 3px solid
          ${sortOrder === DESC
            ? arrow.selectedColor(props)
            : arrow.defaultColor(props)};
        bottom: 0;
        content: ' ';
      }
    }

    &:hover > span {
      &::before {
        border-bottom: 3px solid
          ${sortOrder === ASC
            ? arrow.selectedColor(props)
            : arrow.hoverColor(props)};
      }
      &::after {
        border-top: 3px solid
          ${sortOrder === DESC
            ? arrow.selectedColor(props)
            : arrow.hoverColor(props)};
      }
    }
  `;
};

export const cellStyle = css`
  border: none;
  padding: ${math.divide(gridSize, 2)}px ${gridSize}px;
  text-align: left;

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;
