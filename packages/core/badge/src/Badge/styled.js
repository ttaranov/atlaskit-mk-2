// @flow

import React from 'react';
import styled from 'styled-components';

type Props = {
  backgroundColor?: string,
  textColor?: string,
};

const InternalStyledContainer = styled.div`
  ${props => `
    background-color: ${props.backgroundColor};
    color: ${props.textColor};
    ${props.onClick ? 'border: 3px solid red' : ''};
  `} border-radius: 2em;
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
  min-width: 1px;
  padding: 0.16666666666667em 0.5em;
  text-align: center;
`;

export const Container = (props: Props) => (
  <InternalStyledContainer {...props} />
);
