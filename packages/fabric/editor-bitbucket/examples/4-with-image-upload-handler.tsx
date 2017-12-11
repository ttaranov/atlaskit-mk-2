// tslint:disable:no-console
import * as React from 'react';
import {
  Converter,
  dropHandler,
  pasteHandler,
} from '@atlaskit/editor-test-helpers';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

const isClipboardEvent = (e: Event) => {
  return typeof ClipboardEvent !== 'undefined'
    ? e instanceof ClipboardEvent
    : (e as ClipboardEvent).clipboardData instanceof DataTransfer;
};

const isDragEvent = (e: Event) => {
  return typeof DragEvent !== 'undefined'
    ? e instanceof DragEvent
    : (e as DragEvent).dataTransfer instanceof DataTransfer;
};

const converter = new Converter(['jpg', 'jpeg', 'png', 'gif', 'svg'], 10000000);
const imageUploadHandler = (e: any, fn: any) => {
  // ED-3294: we cannot insert base64 images so we just simulate inserting an image
  const uploadDefaultImage = () =>
    fn({ src: 'https://design.atlassian.com/images/brand/logo-21.png' });
  if (isClipboardEvent(e)) {
    pasteHandler(converter, e, uploadDefaultImage);
  } else if (isDragEvent(e)) {
    dropHandler(converter, e, uploadDefaultImage);
  } else {
    const imageUrl = prompt('Enter the image URL to insert:');
    if (imageUrl) {
      fn({ src: imageUrl });
    }
  }
};

export default function Component() {
  return (
    <BitbucketStyles>
      <Editor
        imageUploadHandler={imageUploadHandler}
        onCancel={CANCEL_ACTION}
        onChange={CHANGE_ACTION}
        onSave={SAVE_ACTION}
      />
    </BitbucketStyles>
  );
}
