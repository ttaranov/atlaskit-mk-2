// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { akColorN90 } from '@atlaskit/util-shared-styles';

export const placeholderStyles = css`
  .ProseMirror .placeholder-decoration {
    position: absolute;
    pointer-events: none;
    user-select: none;

    &::before {
      content: attr(data-text);
      color: ${akColorN90};
      pointer-events: none;
    }
  }
`;
