import { akColorN30 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const ButtonContent = styled.span`
  display: flex;
  width: 80px;
  height: 24px;
  align-items: center;
  padding: ${props => (props.width ? 0 : '0 8px')};
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.span`
  display: flex;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
export const MenuWrapper = styled.span`
  display: flex;
  align-items: center;
  > div > div {
    display: flex;
  }
`;

// tslint:disable-next-line:variable-name
export const ExpandIconWrapper = styled.span`
  margin-left: -8px;
`;
