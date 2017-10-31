// tslint:disable:no-console
import * as React from 'react';
import { base64fileconverter } from '@atlaskit/editor-test-helpers';
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

const { Converter, dropHandler, pasteHandler } = base64fileconverter;
const converter = new Converter(['jpg', 'jpeg', 'png', 'gif', 'svg'], 10000000);
const imageUploadHandler = (e: any, fn: any) => {
  if (isClipboardEvent(e)) {
    pasteHandler(converter, e, fn);
  } else if (isDragEvent(e)) {
    dropHandler(converter, e, fn);
  } else {
    // we cannot trigger a real file viewer from here
    // so we just simulate a succesful image upload and insert an image
    fn({
      src: 'https://design.atlassian.com/images/brand/logo-21.png',
    });
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
