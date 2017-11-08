import styled from 'styled-components';
import { akColorB200 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Container = styled.span`
  cursor: pointer;
  display: inline-flex;
  position: relative;

  .ProseMirror-selectednode & {
    outline: 2px solid ${akColorB200};
  }

  &:hover > div {
    opacity: 0.15;
  }
`;

// Appears on hover over the macro node
// tslint:disable-next-line:variable-name
export const Overlay = styled.div`
  background: #AAA;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  transition: opacity .25s;
`;
