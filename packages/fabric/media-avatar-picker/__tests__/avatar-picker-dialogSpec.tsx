import * as React from 'react';
import { shallow } from 'enzyme';
import ModalDialog from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import { Avatar } from '../src/avatar-list';
import { ImageNavigator } from '../src/image-navigator';
import { PredefinedAvatarList } from '../src/predefined-avatar-list';
import {
  AvatarPickerDialog,
  AvatarPickerDialogProps,
  DEFAULT_VISIBLE_PREDEFINED_AVATARS,
} from '../src/avatar-picker-dialog';

describe('Avatar Picker Dialog', () => {
  const renderWithProps = (props: Partial<AvatarPickerDialogProps>) =>
    shallow(
      <AvatarPickerDialog
        avatars={[]}
        onAvatarPicked={jest.fn()}
        onImagePicked={jest.fn()}
        onCancel={jest.fn()}
        {...props}
      />,
    );

  const newImage = new File(['dsjklDFljk'], 'nice-photo.png', {
    type: 'image/png',
  });

  const renderSaveButton = (props: Partial<AvatarPickerDialogProps> = {}) => {
    const component = renderWithProps(props);
    const { footer } = component.find(ModalDialog).props() as { footer: any };

    return shallow(footer())
      .find(Button)
      .find({ appearance: 'primary' });
  };

  it('when save button is clicked call onSaveImage should be called', () => {
    const onImagePicked = jest.fn();

    const component = renderWithProps({ onImagePicked });
    const { onImageChanged } = component.find(ImageNavigator).props();
    onImageChanged(newImage, { x: 0, y: 0, size: 30 });

    const { footer } = component.find(ModalDialog).props() as { footer: any };

    // click on the save button
    shallow(footer())
      .find(Button)
      .find({ appearance: 'primary' })
      .simulate('click');

    expect(onImagePicked).toBeCalledWith(newImage, { x: 0, y: 0, size: 30 });
  });

  it('when save button is clicked call onSaveAvatar should be called', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
    const avatars = [selectedAvatar];
    const onAvatarPicked = jest.fn();

    const component = renderWithProps({ avatars, onAvatarPicked });
    const { onAvatarSelected } = component.find(PredefinedAvatarList).props();
    onAvatarSelected(selectedAvatar);

    const { footer } = component.find(ModalDialog).props() as { footer: any };
    // click on the save button
    shallow(footer())
      .find(Button)
      .find({ appearance: 'primary' })
      .simulate('click');

    expect(onAvatarPicked).toBeCalledWith(selectedAvatar);
  });

  it('should not render avatar list when imageSource is passed', () => {
    const imageSource = 'some-src';
    const component = renderWithProps({ imageSource });

    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should not render avatar list when there is an image selected', () => {
    const component = renderWithProps({});

    component.setState({ selectedImage: newImage });
    expect(component.find(PredefinedAvatarList)).toHaveLength(0);
  });

  it('should not allow save without selected image or selected avatar', () => {
    const saveButton = renderSaveButton();
    expect(saveButton.props().isDisabled).toBeTruthy();
  });

  it('should allow save with selected image passed as default', () => {
    const imageSource = 'some-src';
    const saveButton = renderSaveButton({ imageSource });
    expect(saveButton.props().isDisabled).toBeFalsy();
  });

  it('should allow save with predefined avatar passed as default', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/453' };
    const avatars = [selectedAvatar];
    const saveButton = renderSaveButton({
      avatars,
      defaultSelectedAvatar: selectedAvatar,
    });
    expect(saveButton.props().isDisabled).toBeFalsy();
  });

  it('should ensure selected avatars beyond visible limit are shown when selected', () => {
    const avatars: Array<Avatar> = [];
    for (let i = 0; i < DEFAULT_VISIBLE_PREDEFINED_AVATARS + 1; i++) {
      avatars.push({ dataURI: `http://an.avatar.com/${i}` });
    }
    // select one past the end of the visible limit
    const selectedAvatar = avatars[DEFAULT_VISIBLE_PREDEFINED_AVATARS];
    const avatarDialog = new AvatarPickerDialog({
      avatars,
      onAvatarPicked: jest.fn(),
      onImagePicked: jest.fn(),
      onCancel: jest.fn(),
      defaultSelectedAvatar: selectedAvatar,
    });
    const predefinedAvatars = avatarDialog.getPredefinedAvatars();

    expect(predefinedAvatars).toHaveLength(DEFAULT_VISIBLE_PREDEFINED_AVATARS);
    expect(predefinedAvatars[DEFAULT_VISIBLE_PREDEFINED_AVATARS - 1]).toBe(
      selectedAvatar,
    );
  });

  it('should render default title', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({ avatars });
    const { header } = component.find(ModalDialog).props() as { header: any };
    const title = shallow(header());
    expect(title.text()).toBe('Upload an avatar');
  });

  it('should by able to customise title', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({
      avatars,
      title: 'test-title',
    });
    const { header } = component.find(ModalDialog).props() as { header: any };
    const title = shallow(header());
    expect(title.text()).toBe('test-title');
  });

  it('should render default primary button text', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({ avatars });
    const { footer } = component.find(ModalDialog).props() as { footer: any };
    const footerComponent = shallow(footer());
    expect(
      (footerComponent
        .find(Button)
        .at(0)
        .props() as React.Props<{}>).children,
    ).toBe('Save');
  });

  it('should by able to customise primary button text', () => {
    const selectedAvatar: Avatar = { dataURI: 'http://an.avatar.com/123' };
    const avatars = [selectedAvatar];
    const component = renderWithProps({
      avatars,
      primaryButtonText: 'test-primary-text',
    });
    const { footer } = component.find(ModalDialog).props() as { footer: any };
    const footerComponent = shallow(footer());
    expect(
      (footerComponent
        .find(Button)
        .at(0)
        .props() as React.Props<{}>).children,
    ).toBe('test-primary-text');
  });
});
