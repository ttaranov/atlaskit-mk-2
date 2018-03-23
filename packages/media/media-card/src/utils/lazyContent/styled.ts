import LazilyRender, { LazilyRenderProps } from 'react-lazily-render';

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { size } from '../../styles';

// necessary because `styled(Component)` uses the props 😭
export type LazilyRenderProps = LazilyRenderProps;

// We need to override the element provided by the library
// in order to make it get the parent dimensions.
export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & LazilyRenderProps
> = styled(LazilyRender)`
  ${size()};
`;
