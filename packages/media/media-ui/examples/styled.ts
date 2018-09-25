import styled from 'styled-components';
import { ComponentClass } from 'react';

export const InputWrapper: ComponentClass = styled.div`
  margin: 20px 0;
`;

export const PreviewList: ComponentClass = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    padding: 0;
  }
`;

export const PreviewInfo: ComponentClass = styled.pre`
  font-size: 80%;
`;
