// @ts-ignore: unused variable
import { css, Styles, StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';

export const GRID_GUTTER = 12;

export const gridStyles = css`
  .gridParent {
    width: calc(100% + ${GRID_GUTTER * 2}px);
    margin-left: -${GRID_GUTTER}px;
    margin-right: -${GRID_GUTTER}px;
    transform: scale(1);
  }

  .gridContainer {
    position: fixed;
    height: 100vh;
    width: 100%;
    border-right: 1px solid ${colors.N30};
    pointer-events: none;
  }

  .gridLine {
    border-left: 1px solid ${colors.N30};
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin-left: -1px;
  }

  .gridContainer.wrapped .gridLine:nth-child(12),
  .gridContainer.wrapped .gridLine:nth-child(2) {
    visibility: hidden;
  }
`;
