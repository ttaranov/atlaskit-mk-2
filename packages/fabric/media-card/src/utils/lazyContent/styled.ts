import LazilyRender from 'react-lazily-render';
import styled from 'styled-components';
import { size } from '../../styles';

// We need to override the element provided by the library
// in order to make it get the parent dimensions.
export const Wrapper = styled(LazilyRender)`
  ${size('inherit')};
`;
