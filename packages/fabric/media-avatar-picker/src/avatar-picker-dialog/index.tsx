import * as React from 'react';
import {PureComponent} from 'react';

import ModalDialog, { ModalFooter } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';

import {Avatar} from '../avatar-list';
import {ImageNavigator, CropProperties} from '../image-navigator';
import {PredefinedAvatarList} from '../predefined-avatar-list';

import {AvatarPickerViewWrapper, ModalHeader} from './styled';
import {PredefinedAvatarView} from '../predefined-avatar-view';

export interface AvatarPickerDialogProps {
  avatars: Array<Avatar>;
  defaultSelectedAvatar?: Avatar;
  onAvatarPicked: (avatar: Avatar) => void;
  imageSource?: string;
  onImagePicked: (file: File, crop: CropProperties) => void;
  onCancel: () => void;
}

export enum Mode {
  Cropping,
  PredefinedAvatars,
}

export interface AvatarPickerDialogState {
  mode: Mode;
  selectedAvatar?: Avatar;
  selectedImage?: File;
  crop: CropProperties;
}

export class AvatarPickerDialog extends PureComponent<AvatarPickerDialogProps, AvatarPickerDialogState> {
  static defaultProps = {
    avatars: []
  };

  constructor() {
    super();

    this.state = {
      mode: Mode.Cropping,
      crop: {
        x: 0,
        y: 0,
        size: 0,
      }
    };
  }

  setSelectedImageState = (selectedImage: File, crop: CropProperties) => {
    this.setState({ selectedImage, crop });
  }

  setSelectedAvatarState = (avatar: Avatar) => {
    this.setState({ selectedAvatar: avatar });
  }

  /**
   * Updates the image position state. These numbers are always positive.
   *
   * @param x the number of pixels from the left edge of the image
   * @param y the number of pixels from the top edge of the image
   */
  setPositionState = (x: number, y: number) => {
    const { size } = this.state.crop;
    this.setState({ crop: { x, y, size }});
  }

  setSizeState = (size: number) => {
    const { x, y } = this.state.crop;
    this.setState({ crop: { x, y, size }});
  }

  onSaveClick = () => {
    if (this.state.selectedImage) {
      this.props.onImagePicked(this.state.selectedImage, this.state.crop);
    } else if (this.state.selectedAvatar) {
      this.props.onAvatarPicked(this.state.selectedAvatar);
    }
  }

  onShowMore = () => {
    this.setState({ mode: Mode.PredefinedAvatars});
  }

  onGoBack = () => {
    this.setState({ mode: Mode.Cropping });
  }

  render() {
    return (
      <ModalDialog
        width="352px"
        header={this.renderHeader()}
        footer={this.renderFooter()}
        onClose={this.props.onCancel}
        isOpen={true}
      >
        <AvatarPickerViewWrapper>
          {this.renderContent()}
        </AvatarPickerViewWrapper>
      </ModalDialog>
    );
  }

  renderHeader() {
    return () => (
      <ModalHeader>Upload an avatar</ModalHeader>
    );
  }

  renderFooter() {
    return () => (
      <ModalFooter>
        <div>
          <Button appearance="primary" onClick={this.onSaveClick}>Save</Button>
          <Button appearance="subtle-link" onClick={this.props.onCancel}>Cancel</Button>
        </div>
      </ModalFooter>
    );
  }

  renderContent() {
    const {imageSource, avatars} = this.props;
    const {mode} = this.state;

    switch (mode) {
      case Mode.Cropping:
        return (
          <div className="cropping-wrapper">
            <div className="cropper">
              <ImageNavigator
                imageSource={imageSource}
                onImageChanged={this.setSelectedImageState}
                onPositionChanged={this.setPositionState}
                onSizeChanged={this.setSizeState}
              />
            </div>
            <div className="predefined-avatars">
              <PredefinedAvatarList
                avatars={avatars.slice(0, 5)}
                onAvatarSelected={this.setSelectedAvatarState}
                onShowMore={this.onShowMore}
              />
            </div>
          </div>
        );
      case Mode.PredefinedAvatars:
        return (
          <div className="predefined-avatars-wrapper">
            <PredefinedAvatarView
              avatars={avatars}
              onAvatarSelected={this.setSelectedAvatarState}
              onGoBack={this.onGoBack}
            />
          </div>
        );
    }
  }
}
