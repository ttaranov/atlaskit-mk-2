// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

// tslint:disable-next-line:variable-name
const ListContainer = styled.div`
  margin: 0 ${props => (props.theme.appearance === 'card' ? '2px' : 0)};
  box-sizing: border-box;
`;

export default ListContainer;
