import {
  defaultCollectionName,
  defaultServiceHost,
  defaultMediaPickerAuthProvider,
  userAuthProvider,
  mediaMock,
} from '@atlaskit/media-test-helpers';

import * as React from 'react';
import Button from '@atlaskit/button';
import { ContextFactory } from '@atlaskit/media-core';

import { MediaPicker } from '../src';

mediaMock.enable();

const context = ContextFactory.create({
  serviceHost: defaultServiceHost,
  authProvider: defaultMediaPickerAuthProvider,
  userAuthProvider: userAuthProvider,
});

const popup = MediaPicker('popup', context, {
  container: document.body,
  uploadParams: {
    collection: defaultCollectionName,
  },
});

popup.show();

export default () => (
  <Button id="show" onClick={() => popup.show()}>
    Show
  </Button>
);
