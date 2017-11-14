import { colors, Color } from './utils';

const telepointerColorStyle = (color: Color, index: number) => `
  &.color-${index} {
    background-color: ${color.selection};
    &::after {
      border-color: ${color.solid};
    }
  }
`;

export const telepointerStyle = `
  {
    position: relative;

    &.telepointer-pointer {
      background-color: rgba(0, 0, 0, 0) !important;
      &::after {
        position: absolute;
        content: ' ';
        border-right: 2px solid #ff0000;
      }
    }

    ${colors.map((color, index) => telepointerColorStyle(color, index))}
  }
`;
