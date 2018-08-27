'use strict';
import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';

import { filesIcon } from '../../../../icons';
import { Browser } from '../../../../components/browser';
import {
  ButtonWrapper,
  DefaultImage,
  DropzoneText,
  DropzoneContainer,
  DropzoneContentWrapper,
  TextWrapper,
} from './styled';

export interface DropzoneProps {
  readonly isEmpty?: boolean;
  readonly mpBrowser: Browser;
}

export class Dropzone extends Component<DropzoneProps> {
  render() {
    const { isEmpty } = this.props;
    return (
      <DropzoneContainer isEmpty={isEmpty}>
        <DropzoneContentWrapper>
          <DefaultImage src={filesIcon} />
          <TextWrapper>
            <DropzoneText>Drag and drop your files anywhere or</DropzoneText>
            <ButtonWrapper>
              <Button
                className="e2e-upload-button"
                appearance="default"
                onClick={this.clickUpload}
                isDisabled={!this.props.mpBrowser}
              >
                Upload a file
              </Button>
            </ButtonWrapper>
          </TextWrapper>
        </DropzoneContentWrapper>
      </DropzoneContainer>
    );
  }

  private clickUpload = () => {
    if (this.props.mpBrowser) {
      this.props.mpBrowser.browse();
    }
  };
}
