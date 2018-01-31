import styled from 'styled-components';
import { akColorN900 } from '@atlaskit/util-shared-styles';

export const Wrapper = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 28px;
  background-color: white;
  border: 2px solid ${akColorN900};
  color: ${akColorN900};
  padding: 5px 10px;
  width: 400px;
  z-index: 10;
`;