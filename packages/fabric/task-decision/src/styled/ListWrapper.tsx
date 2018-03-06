// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, OlHTMLAttributes } from 'react';

// tslint:disable-next-line:variable-name
const ListWrapper = styled.ol`
  list-style-type: none;
  padding-left: 0;
`;

export default ListWrapper;
