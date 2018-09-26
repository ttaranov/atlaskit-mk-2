import styled from 'styled-components';
import { ComponentClass } from 'react';

export const InputWrapper: ComponentClass = styled.div`
  margin: 20px 0;
`;

export const PreviewList: ComponentClass = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const PreviewInfo: ComponentClass = styled.pre`
  font-size: 80%;
`;

export const PreviewItem: ComponentClass = styled.li`
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow: scroll;
  max-height: 600px;
`;
