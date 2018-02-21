// tslint:disable:no-console

import * as React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { Avatar, AvatarPickerDialog, AvatarPickerDialogProps } from '../src';
import { generateAvatars } from '../example-helpers';

const avatars: Array<Avatar> = generateAvatars(30);

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80vh;

  > * {
    max-width: 200px;
  }
`;

interface State {
  isOpen: boolean;
  imagePreviewSource: string;
}

export default class StatefulAvatarPickerDialog extends React.Component<
  Partial<AvatarPickerDialogProps>,
  State
> {
  state = {
    isOpen: true,
    imagePreviewSource: '',
  };

  openPicker = () => {
    this.setState({ isOpen: true });
  };

  closePicker = () => {
    this.setState({ isOpen: false });
  };

  save = dataURI => {
    this.setState({
      imagePreviewSource: dataURI,
      isOpen: false,
    });
  };

  renderPicker() {
    if (!this.state.isOpen) {
      return null;
    }

    return (
      <AvatarPickerDialog
        avatars={avatars}
        onAvatarPicked={selectedAvatar => {
          console.log('onAvatarPicked:', selectedAvatar);
          this.save(selectedAvatar.dataURI);
        }}
        onImagePicked={(selectedImage, crop) => {
          console.log('onImagePicked:', selectedImage, crop);
        }}
        onImagePickedDataURI={exportedImg => {
          console.log('onImagePickedDataURI: ', { dataURI: exportedImg });
          this.save(exportedImg);
        }}
        onCancel={this.closePicker}
        {...this.props}
      />
    );
  }

  render() {
    return (
      <Layout>
        <Button appearance="primary" onClick={this.openPicker}>
          Open sesame!
        </Button>
        {this.renderPicker()}
        <img src={this.state.imagePreviewSource} />
      </Layout>
    );
  }
}
