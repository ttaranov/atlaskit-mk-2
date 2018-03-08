import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

export const Toolbar: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: white;
  border-radius: ${akBorderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
  padding: 5px;
  display: flex;
`;

export const Separator: ComponentClass<HTMLAttributes<{}>> = styled.span`
  border-left: 1px solid ${akColorN30};
  width: 1px;
  display: inline-block;
  margin: 0 5px;
`;
