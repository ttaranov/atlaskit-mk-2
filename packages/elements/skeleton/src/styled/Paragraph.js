// @flow

import React from 'react';
import styled from 'styled-components';
import type { Paragraph as ParagraphProps } from '../types';

const Paragraph = styled.div`
  height: 18px;
  background-color: ${props => props.color || 'currentColor'};
  border-radius: 4px;
  opacity: 0.15;
  margin: 8px;
`;

export default (props: ParagraphProps) => <Paragraph {...props} />;
