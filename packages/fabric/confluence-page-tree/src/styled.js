// @flow
import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const textColor = colors.N800;

export const ErrorTreeContainer = styled.div`
  margin: 40px auto 0px auto;
  text-align: center;
  width: 30%;
  color: ${textColor};
`;

export const DescriptionContainer = styled.div`
  margin: 10px 0px;
`;
