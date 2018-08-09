// @ts-ignore
// @ts-ignore: unused variable
import styled, { ThemedOuterStyledProps } from 'styled-components';
import {
  // @ts-ignore: unused variable
  HTMLAttributes,
  // @ts-ignore: unused variable
  ComponentClass,
} from 'react';
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
export const FieldRangeWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
  margin-bottom: 10px;

  input {
    flex: 1;
  }
`;

export const GridContainer = styled.div`
  margin: 0 auto;
`;

export const Debugger = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 200px;
  height: 400px;
`;

export const DebuggerRow = styled.div`
  display: flex;
`;
interface DebuggerItemProps {
  isEmpty: boolean;
}
export const DebuggerItem = styled.div`
  width: 30px;
  height: 30px;
  margin: 0 4px 4px 0;
  color: white;
  border-radius: 3px;
  padding-top: 5px;
  text-align: center;
  box-sizing: border-box;
  background-color: ${(props: DebuggerItemProps) =>
    props.isEmpty ? '#FF5630' : '#36B37E'};
`;
