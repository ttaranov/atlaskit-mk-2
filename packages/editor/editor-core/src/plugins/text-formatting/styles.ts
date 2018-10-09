// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass, InterpolationFunction, ThemeProps } from 'styled-components';
import { colors } from '@atlaskit/theme';
import { akEditorCodeFontFamily } from '../../styles';
import { relativeSize } from '@atlaskit/editor-common';

export const textFormattingStyles = css`
  .ProseMirror span.code {
    font-size: ${relativeSize(0.857)}px;
    font-weight: normal;
    padding: 2px 1px;
    background: ${colors.N30A};
    border-radius: 3px;
    font-family: ${akEditorCodeFontFamily};
    white-space: pre-wrap;

    &::before,
    &::after {
      vertical-align: text-top;
      display: inline-block;
      width: 3px;
      content: '';
    }
  }
`;
