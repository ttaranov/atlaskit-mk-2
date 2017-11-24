import styled from 'styled-components';
import {
  akColorB200,
  akColorN20,
  akColorN40,
  akColorN70,
  akColorN80,
} from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Placeholder = styled.span`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  vertical-align: middle;

  .ProseMirror-selectednode > & {
    outline: 2px solid ${akColorB200};
  }

  &:hover > div {
    opacity: 0.15;
  }
  &::after,
  &::before {
    vertical-align: text-top;
    display: inline-block;
    width: 1px;
    content: '';
  }
`;

// Appears on hover over the macro node
// tslint:disable-next-line:variable-name
export const Overlay = styled.div`
  background: ${akColorN80};
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  transition: opacity 0.25s;
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallback = styled.span`
  background: ${akColorN20};
  border: 1px solid ${akColorN40};
  padding: 2px;

  .ProseMirror-selectednode & {
    border-color: ${akColorN20};
  }
  & > span {
    vertical-align: middle;
  }
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallbackParams = styled.span`
  text-overflow: ellipsis;
  width: 198px;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  margin-left: 5px;
  vertical-align: middle;
  color: ${akColorN70};
`;
