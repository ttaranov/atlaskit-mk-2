// @ts-ignore: unused variable
import { css, Styles, StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';

export const gridStyles = css`
  .gridParent {
    width: 100%;
    transform: scale(1);
  }

  .gridParent-comment {
    margin: 12px 20px 20px;
  }

  .gridContainer {
    position: fixed;
    height: 100vh;
    width: 100%;
    border-right: 1px solid ${colors.N40};
    pointer-events: none;
  }

  .gridLine {
    border-left: 1px solid ${colors.N40};
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin-left: -1px;
  }
`;
