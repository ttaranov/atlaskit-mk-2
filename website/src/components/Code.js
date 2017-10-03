import React, { type Node } from 'react';
import styled from 'styled-components';

const Pre = styled.pre`
  border-radius: 3px;
  background-color: #eee;
  border: 1px solid #ddd;
  color: #333;
  margin: 20px 0;
  padding: 20px;
`;

export default ({ children }: Node) => <Pre>{children}</Pre>;
