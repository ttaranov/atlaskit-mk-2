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
      position: relative;
      width: calc(100% + 26px);
      /* left-padding (12px) + layout-column-border (1px) */
      left: -13px;

      /* Inner cursor located 26px from left */
      & > * {
        padding: ${akGridSizeUnitless * 1.5}px;
        margin-top: ${akGridSizeUnitless - 1}px;
        flex: 1;
        min-width: 0;
        border: 1px solid transparent;
        border-radius: 5px;
      }
      & > * + * {
        margin-left: ${akGridSizeUnitless - 2}px;
      }

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
