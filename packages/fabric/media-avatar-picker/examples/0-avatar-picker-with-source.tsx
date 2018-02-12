// tslint:disable:no-console

import * as React from 'react';
import { tallImage } from '@atlaskit/media-test-helpers';
import { Avatar, AvatarPickerDialog } from '../src';
import { generateAvatars } from '../example-helpers';
import { fileToDataURI } from '../src/util';

const avatars: Array<Avatar> = generateAvatars(30);

export default () => (
  <AvatarPickerDialog
    avatars={avatars}
    imageSource={tallImage}
    onImagePicked={(selectedImage, crop) => {
      console.log('onImagePicked:', selectedImage, crop);
    }}
    onImagePickedDataURI={dataURI => {
      console.log('onImagePickedDataURI:', { dataURI });
    }}
    onAvatarPicked={selectedAvatar =>
      console.log('onAvatarPicked:', selectedAvatar)
    }
    onCancel={() => console.log('onCancel:')}
  />
);
