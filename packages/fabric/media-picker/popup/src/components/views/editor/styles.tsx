// tslint:disable:variable-name
import { akColorN700A } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// z-index is set to 200 for the main container to be above the dropzone which has z-index 100
export const MainContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: ${akColorN700A};
  z-index: 200;
  overflow: hidden;
`;

export const CenterView = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
