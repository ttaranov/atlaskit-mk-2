import { AuthProvider, Context } from '@atlaskit/media-core';

import { LocalUploadComponent, LocalUploadConfig } from './localUpload';
import { MPClipboardLoaded } from '../outer/analytics/events';
import { MediaPickerContext } from '../domain/context';
import { whenDomReady } from '../util/documentReady';

export interface ClipboardConfig extends LocalUploadConfig {
  readonly userAuthProvider?: AuthProvider;
}

export interface ClipboardConstructor {
  new (
    analyticsContext: MediaPickerContext,
    context: Context,
    clipboardConfig: ClipboardConfig,
  ): Clipboard;
}

export class Clipboard extends LocalUploadComponent {
  constructor(
    analyticsContext: MediaPickerContext,
    context: Context,
    config: ClipboardConfig = { uploadParams: {} },
  ) {
    super(analyticsContext, context, config);
    this.analyticsContext.trackEvent(new MPClipboardLoaded());
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
    const filesArray = Array.from(event.clipboardData.files);
    this.uploadService.addFiles(filesArray);
  };
}
