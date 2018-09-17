// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass, InterpolationFunction, ThemeProps } from 'styled-components';
import { gridSize, fontSize, borderRadius } from '@atlaskit/theme';
import { relativeSize, akEditorElementMinWidth } from '../consts';

export const panelSharedStyles = css`
  & .ak-editor-panel {
    border-radius: ${borderRadius}px;
    margin: ${relativeSize(1.142)}px 0;
    font-size: ${fontSize}px;
    padding: ${gridSize}px;
    min-width: ${akEditorElementMinWidth}px;

    .ak-editor-panel__icon {
      position: absolute;
      height: ${gridSize() * 3}px;
      width: ${gridSize() * 3}px;
    }

    .ak-editor-panel__content {
      margin: 1px 0 1px ${gridSize() * 4}px;
    }
  }
`;
