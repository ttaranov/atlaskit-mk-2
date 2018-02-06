import styled from 'styled-components';
import { akColorN900 } from '@atlaskit/util-shared-styles';

export const MainWrapper = styled.div`
  border: 3px solid ${akColorN900};
  padding: 5px;
  position:absolute;
  width: 800px;
  transform: translateX(-220px);
  transition: transform 400ms ease-in;
`;

export const HeaderWrapper = styled.div`
  padding: 5px;
`;

export const FooterWrapper = styled.div`
  margin-bottom: 10px;
  padding: 5px;
`;