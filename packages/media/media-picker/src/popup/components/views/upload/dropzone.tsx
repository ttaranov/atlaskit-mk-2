'use strict';
import * as React from 'react';
import { Component } from 'react';
import LocalBrowserButton from './uploadButton';
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
    const { isEmpty, mpBrowser } = this.props;
    return (
      <DropzoneContainer isEmpty={isEmpty}>
        <DropzoneContentWrapper>
          <DefaultImage src={filesIcon} />
          <TextWrapper>
            <DropzoneText>Drag and drop your files anywhere or</DropzoneText>
            <ButtonWrapper>
              <LocalBrowserButton mpBrowser={mpBrowser} />
            </ButtonWrapper>
          </TextWrapper>
        </DropzoneContentWrapper>
      </DropzoneContainer>
    );
  }
}
