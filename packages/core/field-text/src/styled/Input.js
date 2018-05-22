// @flow
import styled, { css } from 'styled-components';
import { colors, fontSize } from '@atlaskit/theme';

const getPlaceholderStyle = style => css`
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
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
const getPlaceholderColor = css`
  color: ${colors.placeholderText};
`;

const InputElement = styled.input`
  background: transparent;
  border: 0;
  box-sizing: border-box;
  color: inherit;
  cursor: inherit;
  font-family: inherit;
  font-size: ${fontSize}px;
  outline: none;
  width: 100%;

  &::-ms-clear {
    display: none;
  }

  &:invalid {
    box-shadow: none;
  }
  ${getPlaceholderStyle(getPlaceholderColor)};
`;

export default InputElement;
