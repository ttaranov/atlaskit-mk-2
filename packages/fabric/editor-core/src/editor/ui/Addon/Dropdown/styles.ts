import styled from 'styled-components';
import { akBorderRadius, akColorN60A } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: ${akBorderRadius};
  box-shadow: 0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A};
  box-sizing: border-box;
  padding: 4px 0;
`;
