// tslint:disable:no-console

import * as React from 'react';

import { Avatar, AvatarPickerDialog } from '../src';
import { generateAvatars } from '../example-helpers';
import { tallImage } from '@atlaskit/media-test-helpers';
import { fileToDataURI } from '../src/util';

const avatars: Array<Avatar> = generateAvatars(30);

export default () => (
  <AvatarPickerDialog
    avatars={avatars}
    onImagePicked={(selectedImage, crop) => {
      console.log('onImagePicked', selectedImage, crop);
    }}
    onAvatarPicked={selectedAvatar =>
      console.log('onAvatarPicked', selectedAvatar)
    }
    onCancel={() => console.log('onCancel')}
  />
);
