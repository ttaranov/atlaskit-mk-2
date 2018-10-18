// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { mediaSingleSharedStyle } from '@atlaskit/editor-common';
import { colors } from '@atlaskit/theme';

export const mediaStyles = css`
  .ProseMirror {
    ${mediaSingleSharedStyle} & [layout='full-width'] .media-single,
    & [layout='wide'] .media-single {
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

  .mediaSingle-resize-handle-right,
  .mediaSingle-resize-handle-left {
    display: flex;
    flex-direction: column;

    /* vertical align */
    justify-content: center;
  }

  .mediaSingle-resize-handle-right {
    align-items: flex-end;
    padding-right: 12px;
    margin-right: -12px;
  }

  .mediaSingle-resize-handle-left {
    align-items: flex-start;
    padding-left: 12px;
    margin-left: -12px;
  }

  .mediaSingle-resize-handle-right::after,
  .mediaSingle-resize-handle-left::after {
    content: ' ';
    display: flex;
    width: 3px;
    height: 64px;

    border-radius: 6px;
  }

  .mediaSingle-selected .mediaSingle-resize-handle-right::after,
  .mediaSingle-selected .mediaSingle-resize-handle-left::after,
  .media-single:hover .mediaSingle-resize-handle-left::after,
  .media-single:hover .mediaSingle-resize-handle-right::after {
    background: ${colors.N60};
  }

  .media-single .mediaSingle-resize-handle-right:hover::after,
  .media-single .mediaSingle-resize-handle-left:hover::after,
  .media-single.is-resizing .mediaSingle-resize-handle-right::after,
  .media-single.is-resizing .mediaSingle-resize-handle-left::after {
    background: ${colors.B200};
  }

  .__resizable_base__ {
    left: unset !important;
    width: auto !important;
    height: auto !important;
  }
`;

/* `left: unset` above is to work around Chrome bug where rendering a div with
 * that style applied inside a container that has a scroll, causes any svgs on
 * the page, without a border, that are inside a flexbox, to no longer align to
 * the center of their viewbox.
 * 
 * for us, this means that all the toolbar icons start jumping around if
 * you make the viewport small
 */
