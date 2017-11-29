import styled from 'styled-components';
import { colors, layers, themed } from '@atlaskit/theme';

// NOTE:
// we can't use @atlaskit/blanket because the z-index is insufficient

const backgroundColor = themed({ light: colors.N100A, dark: colors.DN90A });

export default styled.div`
  background: ${backgroundColor};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 220ms;
  z-index: ${layers.spotlight};
`;
