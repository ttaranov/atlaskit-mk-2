/* tslint:disable:no-console */
import * as React from 'react';
import { Component } from 'react';
import {
  createUploadContext,
  defaultMediaPickerCollectionName,
  I18NWrapper,
} from '@atlaskit/media-test-helpers';
import { MediaPicker } from '../src';
import {
  DropzoneContainer,
  PopupContainer,
  DropzoneContentWrapper,
} from '../example-helpers/styled';
import { intlShape } from 'react-intl';

export interface DropzoneWrapperState {
  isActive: boolean;
}

class DropzoneWrapper extends Component<{}, DropzoneWrapperState> {
  dropzoneContainer?: HTMLDivElement;

  static contextTypes = {
    intl: intlShape,
  };

  state: DropzoneWrapperState = {
    isActive: true,
  };

  componentWillReceiveProps(_: any, nextContext: any) {
    if (this.context.intl !== nextContext.intl) {
      this.createMediaPicker(nextContext);
    }
  }

  createMediaPicker(reactContext: any) {
    const context = createUploadContext();
    const dropzone = MediaPicker('dropzone', context, {
      container: this.dropzoneContainer,
      uploadParams: {
        collection: defaultMediaPickerCollectionName,
      },
      proxyReactContext: reactContext,
    });

    dropzone.activate();
  }

  saveDropzoneContainer = (element: HTMLDivElement) => {
    this.dropzoneContainer = element;

    this.createMediaPicker(this.context);
  };

  render() {
    const { isActive } = this.state;

    return (
      <PopupContainer>
        <DropzoneContentWrapper>
          <DropzoneContainer
            isActive={isActive}
            innerRef={this.saveDropzoneContainer}
          />
        </DropzoneContentWrapper>
      </PopupContainer>
    );
  }
}

export default () => (
  <I18NWrapper>
    <DropzoneWrapper />
  </I18NWrapper>
);
