// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
const Separator = styled.span`
  background: ${akColorN30};
  height: 100%;
  padding-left: 1px;
  margin: 2px 8px;
`;

export default Separator;
