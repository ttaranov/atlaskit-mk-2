//@flow
import React from 'react';
import styled from 'styled-components';

const StyledEllipses = styled.span`
  display: flex;
  text-align: center;
  align-items: center;
  padding: 0 8px;
`;

export default function Ellipses() {
  return <StyledEllipses>...</StyledEllipses>;
}
