import * as React from 'react';
import { Component } from 'react';
import { Wrapper, Content, Label, Glass } from './styled';
import { UploadIcon } from './icons';

export interface DropzoneProps {
  isActive: boolean;
}

export class Dropzone extends Component<DropzoneProps, {}> {
  render() {
    const { isActive } = this.props;

    return (
      <Wrapper isActive={isActive}>
        <Content>
          <UploadIcon />
          <Label>Drop your files to upload</Label>
        </Content>
        <Glass />
      </Wrapper>
    );
  }
}
