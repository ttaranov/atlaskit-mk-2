import styled, { css } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export const SearchBox = styled.div`
  position: sticky;
  top: 0;
  z-index: 1; /* required to keep the search box on top of icons in results when sticky */
  background-color: ${colors.N0};
  color: ${colors.N500};
  display: flex;
  height: 36px;
  padding-bottom: 2px;
  border-bottom: 2px solid ${colors.B200};
`;

export const SearchFieldBaseInner = styled.div`
  padding-right: ${gridSize() *
    2}px; /* pad search text from FieldBase's isLoading spinner */
  display: flex;
  flex-grow: 1;
`;

export const SearchInner = styled.div`
  padding-right: ${gridSize() * 3}px;
`;

export const getPlaceholderStyle = (style: any) => css`
  &::-webkit-input-placeholder {
    ${style};
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    ${style} opacity: 1;
  }
  &::-ms-input-placeholder {
    /* Microsoft Edge */
    ${style};
  }
  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    ${style} opacity: 1;
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    ${style};
  }
`;

export const getPlaceholderColor = css`
  color: ${colors.placeholderText};
`;

export const SearchInput = styled.input`
  background-color: ${colors.N0};
  border: 0;
  color: ${colors.N500};
  flex-grow: 1;
  font-size: 1.4em;
  outline: 0;
  ${getPlaceholderStyle(getPlaceholderColor)};
`;
