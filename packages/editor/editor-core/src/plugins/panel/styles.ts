// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

export const panelStyles = css`
  .ProseMirror {
    .panelView-content-wrap {
      min-height: 42px;
      margin: ${akGridSizeUnitless / 2}px 0;
      padding: 1px 0;

      & > .panel-content-dom {
        padding: ${akGridSizeUnitless}px;
      }
    }
  }
`;
