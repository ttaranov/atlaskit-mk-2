import styled from 'styled-components';
import {
  akColorN20,
  akColorN800,
} from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 32px 8px 12px;
  color: ${akColorN800};
  > span {
    display: flex;
    margin-right: 8px;
  }
  &:hover {
    background-color: ${akColorN20};
  }
`;
