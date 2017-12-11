import * as React from 'react';
import { PureComponent } from 'react';

import ModalDialog, { ModalFooter } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';

import { Avatar } from '../avatar-list';
import { ImageNavigator, CropProperties } from '../image-navigator';
import { PredefinedAvatarList } from '../predefined-avatar-list';

import {
  AvatarPickerViewWrapper,
  ModalHeader,
  CroppingWrapper,
} from './styled';
import { PredefinedAvatarView } from '../predefined-avatar-view';

export const DEFAULT_VISIBLE_PREDEFINED_AVATARS = 5;

export interface AvatarPickerDialogProps {
  avatars: Array<Avatar>;
  defaultSelectedAvatar?: Avatar;
  onAvatarPicked: (avatar: Avatar) => void;
  imageSource?: string;
  onImagePicked: (file: File, crop: CropProperties) => void;
  onCancel: () => void;
  title?: string;
  primaryButtonText?: string;
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

export class AvatarPickerDialog extends PureComponent<
  AvatarPickerDialogProps,
  AvatarPickerDialogState
> {
  static defaultProps = {
    avatars: [],
  };

  state: AvatarPickerDialogState = {
    mode: Mode.Cropping,
    crop: {
      x: 0,
      y: 0,
      size: 0,
    },
    selectedAvatar: this.props.defaultSelectedAvatar,
  };

  setSelectedImageState = (selectedImage: File, crop: CropProperties) => {
    this.setState({ selectedImage, crop });
  };

  setSelectedAvatarState = (avatar: Avatar) => {
    this.setState({
      selectedAvatar: avatar,
    });
  };

  /**
   * Updates the image position state. These numbers are always positive.
   *
   * @param x the number of pixels from the left edge of the image
   * @param y the number of pixels from the top edge of the image
   */
  setPositionState = (x: number, y: number) => {
    const { size } = this.state.crop;
    this.setState({ crop: { x, y, size } });
  };

  setSizeState = (size: number) => {
    const { x, y } = this.state.crop;
    this.setState({ crop: { x, y, size } });
  };

  onSaveClick = () => {
    const { onImagePicked, onAvatarPicked } = this.props;
    const { selectedImage, crop, selectedAvatar } = this.state;

    if (selectedImage) {
      onImagePicked(selectedImage, crop);
    } else if (selectedAvatar) {
      onAvatarPicked(selectedAvatar);
    }
  };

  onShowMore = () => {
    this.setState({ mode: Mode.PredefinedAvatars });
  };

  onGoBack = () => {
    this.setState({ mode: Mode.Cropping });
  };

  render() {
    return (
      <ModalDialog
        height="437px"
        width="360px"
        header={this.headerContent}
        footer={this.footerContent}
        onClose={this.props.onCancel}
        isOpen={true}
      >
        <AvatarPickerViewWrapper>{this.renderBody()}</AvatarPickerViewWrapper>
      </ModalDialog>
    );
  }

  headerContent = () => {
    const { title } = this.props;
    return <ModalHeader>{title || 'Upload an avatar'}</ModalHeader>;
  };

  footerContent = () => {
    const { primaryButtonText, onCancel } = this.props;
    const { onSaveClick, isDisabled } = this;
    return (
      <ModalFooter>
        <div>
          <Button
            appearance="primary"
            onClick={onSaveClick}
            isDisabled={isDisabled}
          >
            {primaryButtonText || 'Save'}
          </Button>
          <Button appearance="subtle-link" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </ModalFooter>
    );
  };

  get isDisabled() {
    return !(
      this.props.imageSource ||
      this.state.selectedImage ||
      this.state.selectedAvatar
    );
  }

  get isAvatarListVisible() {
    const { imageSource } = this.props;
    const { selectedImage } = this.state;

    return !imageSource && !selectedImage;
  }

  getPredefinedAvatars() {
    const { avatars } = this.props;
    const { selectedAvatar } = this.state;
    const avatarsSubset = avatars.slice(0, DEFAULT_VISIBLE_PREDEFINED_AVATARS);
    if (
      selectedAvatar &&
      avatars.indexOf(selectedAvatar) >= DEFAULT_VISIBLE_PREDEFINED_AVATARS
    ) {
      avatarsSubset[avatarsSubset.length - 1] = selectedAvatar;
    }
    return avatarsSubset;
  }

  renderPredefinedAvatarList() {
    const { selectedAvatar } = this.state;
    const { isAvatarListVisible } = this;
    const avatars = this.getPredefinedAvatars();
    if (!isAvatarListVisible) {
      return null;
    }

    return (
      <PredefinedAvatarList
        selectedAvatar={selectedAvatar}
        avatars={avatars}
        onAvatarSelected={this.setSelectedAvatarState}
        onShowMore={this.onShowMore}
      />
    );
  }

  renderBody() {
    const { imageSource, avatars } = this.props;
    const { mode, selectedAvatar } = this.state;

    switch (mode) {
      case Mode.Cropping:
        return (
          <CroppingWrapper>
            <ImageNavigator
              imageSource={imageSource}
              onImageChanged={this.setSelectedImageState}
              onPositionChanged={this.setPositionState}
              onSizeChanged={this.setSizeState}
            />
            {this.renderPredefinedAvatarList()}
          </CroppingWrapper>
        );
      case Mode.PredefinedAvatars:
        return (
          <div>
            <PredefinedAvatarView
              avatars={avatars}
              onAvatarSelected={this.setSelectedAvatarState}
              onGoBack={this.onGoBack}
              selectedAvatar={selectedAvatar}
            />
          </div>
        );
    }
  }
}
