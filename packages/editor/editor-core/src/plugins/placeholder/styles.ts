// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';

export const placeholderStyles = css`
  .ProseMirror .placeholder-decoration {
    position: absolute;
    pointer-events: none;
    user-select: none;

    &::before {
      content: attr(data-text);
      color: ${colors.N90};
      pointer-events: none;
    }
  }
`;
