import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';

const Separator: ComponentClass<HTMLAttributes<HTMLSpanElement>> = styled.span`
  background: ${akColorN30};
  height: 100%;
  padding-left: 1px;
  margin: 2px 8px;
`;

export default Separator;
