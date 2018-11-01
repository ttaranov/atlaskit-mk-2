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
    padding: 2px 0px 2px 0px;
    background-color: ${colors.N30A};
    box-decoration-break: clone;
    border-radius: 3px;
    font-family: ${akEditorCodeFontFamily};
    white-space: pre-wrap;
    margin: 0 4px 0 4px;
    box-shadow: -4px 0 0 0 ${colors.N30A}, 4px 0 0 0 ${colors.N30A};

    &::before,
    &::after {
      vertical-align: text-top;
      display: inline-block;
      content: '';
    }
  }
`;
