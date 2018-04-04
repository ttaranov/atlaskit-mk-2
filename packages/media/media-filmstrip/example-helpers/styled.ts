import styled, { ThemedOuterStyledProps } from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { akColorN50A } from '@atlaskit/util-shared-styles';

export interface MutableCardContainerProps {
  mutable: boolean;
}

export const MutableCardContainer: ComponentClass<
  HTMLAttributes<{}> & ThemedOuterStyledProps<MutableCardContainerProps, {}>
> = styled.div`
  min-width: 250px;
  height: 200px;
  background-color: ${(props: MutableCardContainerProps) =>
    props.mutable ? 'lightgreen' : 'darkgreen'};

  h3 {
    font-size: 20pt;
  }
`;

export const MutableCardContentContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  height: 50px;
  width: 100%;
`;

export const FilmstripContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  border: 1px dotted ${akColorN50A};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Code: ComponentClass<HTMLAttributes<{}>> = styled.code`
  font-family: monospace;
  padding: 3px;
  border-radius: 5px;
`;
