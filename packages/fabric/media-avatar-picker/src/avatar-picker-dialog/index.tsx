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
  ModalFooterButtons,
} from './styled';
import { PredefinedAvatarView } from '../predefined-avatar-view';
import { dataURItoFile, fileToDataURI } from '../util';
import { CONTAINER_SIZE } from '../image-navigator/index';
import { LoadParameters } from '../image-cropper';

export const DEFAULT_VISIBLE_PREDEFINED_AVATARS = 5;

export interface AvatarPickerDialogProps {
  avatars: Array<Avatar>;
  defaultSelectedAvatar?: Avatar;
  onAvatarPicked: (avatar: Avatar) => void;
  imageSource?: string;
  onImagePicked?: (file: File, crop: CropProperties) => void;
  onImagePickedDataURI?: (dataUri: string) => void;
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
  selectedImageSource?: string;
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
      size: CONTAINER_SIZE,
    },
    selectedAvatar: this.props.defaultSelectedAvatar,
    selectedImageSource: this.props.imageSource,
    selectedImage: undefined,
  };

  setSelectedImageState = (selectedImage: File, crop: CropProperties) => {
    // this is the main method to update the image state,
    // it is bubbled from the ImageCropper component through ImageNavigator when the image is loaded.
    this.setState({ selectedImage, crop });
    fileToDataURI(selectedImage).then(dataURI => {
      this.setState({ selectedImageSource: dataURI });
    });
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

  onImageNavigatorLoad = (loadParams: LoadParameters) => {
    this.exportCroppedImage = loadParams.export;
  };

  /**
   * Initialised with no-op function.  Is assigned cropped image exporting
   * function when internal ImageCropper mounts via this.onImageNavigatorLoad
   */
  exportCroppedImage = () => '';

  onSaveClick = () => {
    const {
      imageSource,
      onImagePicked,
      onImagePickedDataURI,
      onAvatarPicked,
    } = this.props;
    const { selectedImage, crop, selectedAvatar } = this.state;
    const image = selectedImage
      ? selectedImage
      : imageSource && dataURItoFile(imageSource);

    if (image) {
      if (onImagePicked) {
        onImagePicked(image, crop);
      }
      if (onImagePickedDataURI) {
        onImagePickedDataURI(this.exportCroppedImage());
      }
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

  onRemoveImage = () => {
    // TODO: clear scale from child components
    this.setState({
      selectedImageSource: undefined,
      selectedImage: undefined,
      mode: Mode.Cropping,
    });
  };

  render() {
    return (
      <ModalDialog
        height="460px"
        width="375px"
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
        <ModalFooterButtons>
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
        </ModalFooterButtons>
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
    const { selectedAvatar, selectedImage, selectedImageSource } = this.state;
    const avatars = this.getPredefinedAvatars();

    if (selectedImage || selectedImageSource) {
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
    const { avatars } = this.props;
    const { mode, selectedImageSource, selectedAvatar } = this.state;

    switch (mode) {
      case Mode.Cropping:
        return (
          <CroppingWrapper>
            <ImageNavigator
              imageSource={selectedImageSource}
              onImageChanged={this.setSelectedImageState}
              onLoad={this.onImageNavigatorLoad}
              onPositionChanged={this.setPositionState}
              onSizeChanged={this.setSizeState}
              onRemoveImage={this.onRemoveImage}
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
