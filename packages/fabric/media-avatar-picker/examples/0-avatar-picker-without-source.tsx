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
      fileToDataURI(selectedImage).then(dataURI => {
        // show the image back in the DOM for functional testing
        const img = new Image();
        img.src = dataURI;
        img.style.cssText =
          'position:absolute;left:0;top:0;max-width:50%;max-height:50%;z-index:1000';
        document.body.appendChild(img);
      });
    }}
    onAvatarPicked={selectedAvatar =>
      console.log('onAvatarPicked', selectedAvatar)
    }
    onCancel={() => console.log('onCancel')}
  />
);
