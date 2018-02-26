import styled from 'styled-components';
import { maxAvatarCount } from '../shared/CardDetails/Users';

export const ActionsStateWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

export const AlertWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  /* z-index has to be 1 higher than the number of avatars in the avatar stack */
  z-index: ${maxAvatarCount + 1};
`;
