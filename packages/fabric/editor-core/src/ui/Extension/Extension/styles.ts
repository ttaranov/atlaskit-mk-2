import styled from 'styled-components';
import { akColorN30, akBorderRadius } from '@atlaskit/util-shared-styles';
import { padding } from '../styles';

export const Header = styled.div`
  cursor: pointer;
  padding: ${padding / 2}px ${padding / 2}px ${padding / 4}px;
  vertical-align: middle;

  img {
    display: flex;
    padding: ${padding / 2}px;
  }
`;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: ${padding}px;
  background: white;
  border: 1px solid ${akColorN30};
  border-radius: ${akBorderRadius};
`;

// tslint:disable-next-line:variable-name
export const ContentWrapper = styled.div`
  padding: 0 ${padding}px ${padding}px;

  /*
    if node with "content hole" rendered without content (like block bodyless extension),
    PM throws errors when it is selected (with triple click)
    we just hide node's body with css
  */
  &.bodyless {
    position: absolute;
    left: -9999px;
  }
`;
