// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { mediaSingleSharedStyle } from '@atlaskit/editor-common';

export const mediaStyles = css`
  .ProseMirror {
    ${mediaSingleSharedStyle} & [layout='full-width'] > div,
    & [layout='wide'] > div {
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .media-single.is-loading {
      min-height: 20px;
    }

    & [layout='wrap-left'] + [layout='wrap-right'],
    & [layout='wrap-right'] + [layout='wrap-left'] {
      clear: none;
      & + p,
      & + ul,
      & + ol,
      & + h1,
      & + h2,
      & + h3,
      & + h4,
      & + h5,
      & + h6 {
        clear: both;
      }
      & > div {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
`;
