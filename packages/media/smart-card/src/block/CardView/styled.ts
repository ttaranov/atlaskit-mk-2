import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { maxAvatarCount } from '../expanded/ResolvedView/Users';

export const ActionsStateWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

export const AlertWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
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
