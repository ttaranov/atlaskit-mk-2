import styled, { css } from 'styled-components';
import { colors } from '@atlaskit/theme';
import { getProvided } from '../../theme/util';

const getPlaceholderStyle = style => css`
&::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  ${style}
}
&:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   ${style}
   opacity:  1;
}
&::-moz-placeholder { /* Mozilla Firefox 19+ */
   ${style}
   opacity:  1;
}
&:-ms-input-placeholder { /* Internet Explorer 10-11 */
   ${style}
}
&::-ms-input-placeholder { /* Microsoft Edge */
   ${style}
}
`;
const getPlaceholderColor = css`color: ${colors.placeholderText};`;

const SearchInput = styled.input`
  background-color: ${({ theme }) => getProvided(theme).background.tertiary};
  border: 0;
  color: ${({ theme }) => getProvided(theme).text};
  flex-grow: 1;
  font-size: 1.4em;
  outline: 0;
  ${getPlaceholderStyle(getPlaceholderColor)}
`;

SearchInput.displayName = 'SearchInput';
export default SearchInput;
