// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorB200,
  akColorN40,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';
import { columnLayoutSharedStyle } from '@atlaskit/editor-common';

export const layoutStyles = css`
  .ProseMirror {
    ${columnLayoutSharedStyle} [data-layout-type] {
      /* Ensure first column aligns with the cursor on top-level paragraph */
      /* (margin + padding) === 24 | 24 * 2 === 48 */
      position: relative;
      width: calc(100% + 48px);
      /* (48px / 2) + layout-section-border (2px) + layout-column-border (2px) */
      left: -28px;

      /* Inner cursor located 26px from left */
      & > * {
        margin: ${akGridSizeUnitless}px;
        padding: ${akGridSizeUnitless * 2}px;
        flex: 1;
        min-width: 0;
        border: 2px solid transparent;
        border-radius: 5px;
      }

      border: 2px solid transparent;
      border-radius: 5px;

      /**
        * Border to show when node is selected
        * Helps visualise when 'selectNodeBackwards' selects the node for deletion
        */
      &.ProseMirror-selectednode > * {
        border-color: ${akColorB200};
      }
      /* Shows the border when cursor is inside a layout */
      &.selected > * {
        border-color: ${akColorN40};
      }
    }
  }
`;
