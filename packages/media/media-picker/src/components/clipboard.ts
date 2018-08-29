import { AuthProvider, Context } from '@atlaskit/media-core';

import { LocalUploadComponent, LocalUploadConfig } from './localUpload';
import { whenDomReady } from '../util/documentReady';
import { appendTimestamp } from '../util/appendTimestamp';

export interface ClipboardConfig extends LocalUploadConfig {
  readonly userAuthProvider?: AuthProvider;
}

export interface ClipboardConstructor {
  new (context: Context, clipboardConfig: ClipboardConfig): Clipboard;
}

export const getFilesFromClipboard = (files: FileList) => {
  return Array.from(files).map(file => {
    if (file.type.indexOf('image/') === 0) {
      const name = appendTimestamp(file.name, (file as any).lastModified);
      return new File([file], name, {
        type: file.type,
      });
    } else {
      return file;
    }
  });
};

export class Clipboard extends LocalUploadComponent {
  constructor(
    context: Context,
    config: ClipboardConfig = { uploadParams: {} },
  ) {
    super(context, config);
  }

  public async activate(): Promise<void> {
    await whenDomReady;

    this.deactivate();
    document.addEventListener('paste', this.pasteHandler, false);
  }

  public deactivate(): void {
    document.removeEventListener('paste', this.pasteHandler);
  }

  private pasteHandler = (event: ClipboardEvent): void => {
    /*
      Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
      @see https://extranet.atlassian.com/display/FIL/RFC+099%3A+Clipboard+browser+inconsistency
    */
    const { clipboardData } = event;

    if (clipboardData && clipboardData.files) {
      const filesArray = getFilesFromClipboard(clipboardData.files);
      this.uploadService.addFiles(filesArray);
    }
  };
}
