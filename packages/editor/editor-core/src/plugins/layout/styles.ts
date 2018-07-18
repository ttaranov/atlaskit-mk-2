// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorN40,
  akColorB200,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

export const layoutStyles = css`
  .ProseMirror [data-layout-type] {
    display: flex;
    flex-direction: row;
    border: 2px solid transparent;
    border-radius: 5px;
    /* Ensure first column aligns with the cursor on top-level paragraph */
    /* (margin + padding) === 24 | 24 * 2 === 48 */
    position: relative;
    width: calc(100% + 48px);
    /* (48px / 2) + layout-section-border (2px) + layout-column-border (2px) */
    left: -28px;

    /* Inner cursor located 26px from left */
    & > * {
      border: 2px solid ${akColorN40};
      border-radius: 5px;
      margin: ${akGridSizeUnitless}px;
      padding: ${akGridSizeUnitless * 2}px;
      flex: 1;
      min-width: 0;
    }

    /**
      * Border to show when node is selected
      * Helps visualise when 'selectNodeBackwards' selects the node for deletion
      */
    &.ProseMirror-selectednode {
      border-color: ${akColorB200};
    }
  }

  .ProseMirror [data-layout-type='two_equal'],
  .ProseMirror [data-layout-type='three_equal'] {
    /** do nothing */
  }
  .ProseMirror [data-layout-type='two_left_sidebar'] {
    & > *:first-child {
      flex-grow: 0.5;
    }
  }
  .ProseMirror [data-layout-type='two_right_sidebar'] {
    & > *:last-child {
      flex-grow: 0.5;
    }
  }
  .ProseMirror [data-layout-type='three_with_sidebars'] {
    & > *:last-child,
    & > *:first-child {
      flex-grow: 0.5;
    }
  }
`;
