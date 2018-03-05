// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { colors } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
const DateGroupHeader = styled.div`
  color: ${colors.N200};
  font-size: 12px;
  font-weight: 500;
  margin: 12px 0 4px 0;
`;

export default DateGroupHeader;
