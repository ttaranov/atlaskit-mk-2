<<<<<<< origin/master:packages/media/media-card/src/app_2/ApplicationCard/styled.ts
import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { maxAvatarCount } from '../shared/CardDetails/Users';
=======
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { maxAvatarCount } from './CardDetails/Users';
>>>>>>> HEAD~5:packages/media/smart-card/src/CardView/styled.ts

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
