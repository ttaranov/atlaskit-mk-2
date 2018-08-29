// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import { akEditorBlockquoteBorderColor } from '../../styles';

export const blocktypeStyles = css`
  .ProseMirror blockquote {
    box-sizing: border-box;
    padding-left: ${akGridSizeUnitless * 2}px;
    border-left: 2px solid ${akEditorBlockquoteBorderColor};
    margin: ${akGridSizeUnitless * 1.5}px 0 0 0;
    margin-right: 0;

    [dir='rtl'] & {
      padding-left: 0;
      padding-right: ${akGridSizeUnitless * 2}px;
    }

    &:first-child {
      margin-top: 0;
    }

    &::before {
      content: '';
    }

    &::after {
      content: none;
    }

    & p {
      display: block;
    }

    & table,
    & table:last-child {
      display: inline-table;
    }
  }
`;
