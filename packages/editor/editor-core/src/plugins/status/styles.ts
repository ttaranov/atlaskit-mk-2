// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass, InterpolationFunction, ThemeProps } from 'styled-components';
import { panelSharedStyles } from '@atlaskit/editor-common';

export const statusStyles_ = css`
  & .ak-editor-status {
    .ak-editor-status__content {
      display: inline-block;
    }
  }
`;

export const statusStyles = css`
  .ProseMirror {
    ${statusStyles_};
  }
`;
