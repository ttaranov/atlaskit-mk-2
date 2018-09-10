import styled from 'styled-components';
import { akColorN50A } from '@atlaskit/util-shared-styles';

export interface MutableCardContainerProps {
  mutable: boolean;
}

export const MutableCardContainer = styled.div`
  min-width: 250px;
  height: 200px;
  background-color: ${(props: MutableCardContainerProps) =>
    props.mutable ? 'lightgreen' : 'darkgreen'};

  h3 {
    font-size: 20pt;
  }
`;

export const MutableCardContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  height: 50px;
  width: 100%;
`;

export const FilmstripContainer = styled.div`
  border: 1px dotted ${akColorN50A};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Code = styled.code`
  font-family: monospace;
  padding: 3px;
  border-radius: 5px;
`;

export const ExampleWrapper = styled.div``;

export const FilmstripWrapper = styled.div`
  border: 1px solid #ccc;
  width: 800px;
  margin-bottom: 20px;
`;
