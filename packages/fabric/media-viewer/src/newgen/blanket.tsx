import styled from 'styled-components';
import * as style from '@atlaskit/util-shared-styles';

export const Component = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${style.akColorN900};
  overflow: hidden;
  z-index: 9;

  * {
    box-sizing: border-box;
  }

  &:hover {
    .visible-on-hover {
      opacity: 1;
    }
  }

  .visible-on-hover {
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
  }
`;
