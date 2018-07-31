// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme';
import { relativeSize } from '../../styles';

export const panelStyles = css`
  .ProseMirror {
    .panelView-content-wrap {
      min-height: 42px;
      margin: ${relativeSize(1.142)}px 0;
      padding: 1px 0;
      font-size: ${fontSize}px;

      & > .panel-content-dom {
        padding: ${gridSize}px;
      }
    }
  }
`;
