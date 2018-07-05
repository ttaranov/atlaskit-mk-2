// @flow

import type { Node } from 'react';

import React from 'react';
import styled, { css } from 'styled-components';
import Themed from './Themed';

const orTextColor = preferred => p => p[preferred] || p.textColor;
const Div = styled.div`
  ${p => css`
    background-color: ${p.backgroundColor};
    color: ${p.textColor};

    a {
      color: ${orTextColor('linkColor')};
    }
    a:hover {
      color: ${orTextColor('linkColorHover')};
    }
    a:active {
      color: ${orTextColor('linkColorActive')};
    }
    a:focus {
      outline-color: ${orTextColor('inkColorOutline')};
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      color: ${orTextColor('headingColor')};
    }
    h6 {
      color: ${orTextColor('subtleHeadingColor')};
    }
    small {
      color: ${orTextColor('subtleTextColor')};
    }
  `};
`;

export default ({ children, ...props }: { children: Node }) => (
  <Themed>
    {theme => (
      <Div {...theme} {...props}>
        {children}
      </Div>
    )}
  </Themed>
);
