import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface PickerStyleProps {
  width?: number;
}

export const PickerStyle: ComponentClass<
  HTMLAttributes<{}> & PickerStyleProps
> = styled.div`
  padding: 20px;
  width: ${(props: PickerStyleProps) => `${props.width}px`};
`;
