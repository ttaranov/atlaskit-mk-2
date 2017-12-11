import { LocalUploadComponent } from './localUpload';
import { MPClipboardLoaded } from '../outer/analytics/events';
import { MediaPickerContext } from '../domain/context';
import { ModuleConfig } from '../domain/config';
import domready = require('domready');

export interface ClipboardConstructor {
  new (context: MediaPickerContext, config: ModuleConfig): Clipboard;
}

export class Clipboard extends LocalUploadComponent {
  constructor(context: MediaPickerContext, config: ModuleConfig) {
    super(context, config);
    this.context.trackEvent(new MPClipboardLoaded());
  }

  public activate(): void {
    domready(() => {
      this.deactivate();
      document.addEventListener('paste', this.pasteHandler, false);
    });
  }

  public deactivate(): void {
    document.removeEventListener('paste', this.pasteHandler);
  }

  private pasteHandler = (event: ClipboardEvent): void => {
    /*
      Browser behaviour for getting files from the clipboard is very inconsistent and buggy.
      @see https://extranet.atlassian.com/display/FIL/RFC+099%3A+Clipboard+browser+inconsistency
    */
    const files = event.clipboardData.files;
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      this.uploadService.addFile(file);
    }
  };
}
