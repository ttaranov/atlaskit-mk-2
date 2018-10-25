import * as React from 'react';
import styled from 'styled-components';

import { Tool, Color } from './common';

// Operations exposed by Media Editor
export interface MediaEditorOperations {
  export(): Promise<string>; // export the image in base64
}

export interface MediaEditorProperties {
  imageUrl: string;
  width: number;
  height: number;
  tool: Tool;
  shapeColor: Color;
  lineThickness: number;
  onLoadSucceeded: (operations: MediaEditorOperations) => void;
  onLoadFailed: (error?: Error) => void;
}

interface MediaEditorState {}

const Container = styled.div`
  overflow: hidden;
  background-color: red;
`;

export class MediaEditor extends React.Component<
  MediaEditorProperties,
  MediaEditorState
> {
  constructor(props: MediaEditorProperties) {
    super(props);

    this.state = {};
  }

  render() {
    const { width, height } = this.props;

    return <Container style={{ width, height }} />;
  }
}
