// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN0 } from '@atlaskit/util-shared-styles';

export const PopupBase: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  pointer-events: auto;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  bottom: 48px;
  padding: 4px;
  background-color: ${akColorN0};
`;

export const LineWidthPopupContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled(PopupBase)`
  right: 270px;
  width: 160px;
  padding: 9px;
`;

export const ColorPopupContainer: ComponentClass<HTMLAttributes<{}>> = styled(
  PopupBase,
)`
  width: 192px;
  right: 226px;
  padding: 8px;
`;
