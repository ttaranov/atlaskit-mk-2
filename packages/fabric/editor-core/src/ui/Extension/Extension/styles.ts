import styled from 'styled-components';
import {
  akColorB200,
  akColorN20,
  akColorN40,
  akColorN70,
  akColorN80,
} from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Wrapper = styled.div`
  background: #f0f0f0;
  border: 1px solid ${akColorN40};

  .ProseMirror-selectednode > & {
    outline: 2px solid ${akColorB200};
  }
`;

export const Header = styled.div`
  cursor: pointer;
  vertical-align: middle;

  img {
    user-select: none;
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
  flex: 1;
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallback = styled.div`
  padding: 2px 0;

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

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  background: white;
  border: 1px solid ${akColorN40};
  padding: 5px;
  margin: 0 3px 3px;
`;
