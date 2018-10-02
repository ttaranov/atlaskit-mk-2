// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = css`
  & h1 {
    line-height: 1.166;
    font-size: 1.714em;
    margin-top: 2.857em;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }
  }

  & h2 {
    line-height: 1.2;
    font-size: 1.43em;
    margin-top: 2.571em;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }
  }

  & h3 {
    line-height: 1.5;
    font-size: 1.142em;
    margin-top: 2.585em;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }
  }

  & h4 {
    line-height: 1.428;
    font-size: 1em;
    margin-top: 1.714em;

    &:first-child {
      margin-top: 0;
    }
  }

  & h5 {
    line-height: 1.333;
    font-size: 0.857em;
    margin-top: 1.43em;

    &:first-child {
      margin-top: 0;
    }
  }

  & h6 {
    line-height: 1.454;
    font-size: 0.785em;
    margin-top: 1.42em;

    &:first-child {
      margin-top: 0;
    }
  }
`;
