// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

const columnLayoutSharedStyle = css`
  [data-layout-type] {
    display: flex;
    flex-direction: row;

    &:after {
      content: ' ';
      display: table;
    }

    &:after {
      clear: both;
    }

    & > * {
      flex: 1;
    }
  }

  [data-layout-type='single'] {
    [data-layout-column] > * {
      margin: 0;
    }
  }

  [data-layout-type][data-size='150'] {
    position: relative;
    left: -25%;
    right: -25%;
    width: calc(100% + 50%);
  }

  [data-layout-type][data-size='200'] {
    position: relative;
    left: -50%;
    right: -50%;
    width: calc(100% + 100%);
  }

  [data-layout-type='float_left'] {
    display: block;

    [data-layout-column] {
      margin-left: 0;
    }

    [data-layout-column]:first-child {
      float: left;
      min-width: 300px;
      width: 50%;
      margin-right: 12px;
      margin-top: 0;
    }
  }

  [data-layout-type='float_right'] {
    display: block;

    [data-layout-column] {
      margin-left: 0;
    }

    [data-layout-column]:first-child {
      float: right;
      min-width: 300px;
      width: 50%;
      margin-left: 12px;
      margin-top: 0;
    }
  }

  [data-layout-type='two_equal'],
  [data-layout-type='three_equal'] {
    /** do nothing */
  }
  [data-layout-type='two_left_sidebar'] {
    & > *:first-child {
      flex-grow: 0.5;
    }
  }
  [data-layout-type='two_right_sidebar'] {
    & > *:last-child {
      flex-grow: 0.5;
    }
  }
  [data-layout-type='three_with_sidebars'] {
    & > *:last-child,
    & > *:first-child {
      flex-grow: 0.5;
    }
  }
`;

export { columnLayoutSharedStyle };
