import LazilyRender, { LazilyRenderProps } from 'react-lazily-render';
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { size } from '../../styles';

// necessary because `styled(Component)` uses the props 😭
export type LazilyRenderProps = LazilyRenderProps;

// We need to override the element provided by the library
// in order to make it get the parent dimensions.
export const Wrapper = styled(LazilyRender)`
  ${size()};
`;
