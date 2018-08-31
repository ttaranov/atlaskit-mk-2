// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

const columnLayoutSharedStyle = css`
  [data-layout-type] {
    display: flex;
    flex-direction: row;
    & > * {
      flex: 1;
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
