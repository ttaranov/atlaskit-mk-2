// @flow

import styled from 'styled-components';
import * as colors from '../colors';

const ThemeReset = styled.div`
  background-color: ${colors.background};
  color: ${colors.text};

  a {
    color: ${colors.link};
  }
  a:hover {
    color: ${colors.linkHover};
  }
  a:active {
    color: ${colors.linkActive};
  }
  a:focus {
    outline-color: ${colors.linkOutline};
  }
  h1 {
    color: ${colors.heading};
  }
  h2 {
    color: ${colors.heading};
  }
  h3 {
    color: ${colors.heading};
  }
  h4 {
    color: ${colors.heading};
  }
  h5 {
    color: ${colors.heading};
  }
  h6 {
    color: ${colors.subtleHeading};
  }
  small {
    color: ${colors.subtleText};
  }
`;

export default ThemeReset;
