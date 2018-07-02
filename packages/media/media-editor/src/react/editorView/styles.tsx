import styled, { ThemedOuterStyledProps } from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const EditorContainer: ComponentClass<
  HTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
