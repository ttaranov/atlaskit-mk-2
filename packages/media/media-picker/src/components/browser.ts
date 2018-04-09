import { LocalUploadComponent } from './localUpload';
import { MPBrowserLoaded } from '../outer/analytics/events';
import { MediaPickerContext } from '../domain/context';
import { Context } from '@atlaskit/media-core';
import { UploadParams } from '..';

export interface BrowserConfig {
  uploadParams: UploadParams;
  multiple?: boolean;
  fileExtensions?: Array<string>;
}

export interface BrowserConstructor {
  new (
    analyticsContext: MediaPickerContext,
    context: Context,
    browserConfig: BrowserConfig,
  ): Browser;
}

export class Browser extends LocalUploadComponent {
  private browseElem: HTMLElement;

  constructor(
    analyticsContext: MediaPickerContext,
    context: Context,
    browserConfig: BrowserConfig = { uploadParams: {} },
  ) {
    super(analyticsContext, context, browserConfig);

    this.browseElem = document.createElement('INPUT');
    this.browseElem.setAttribute('type', 'file');
    this.browseElem.style.display = 'none';

    if (browserConfig.multiple) {
      this.browseElem.setAttribute('multiple', '');
    }

    if (browserConfig.fileExtensions) {
      this.browseElem.setAttribute(
        'accept',
        browserConfig.fileExtensions.join(','),
      );
    }

    // IE11 hack - click will not execute if input has no parent
    // WebDriver hack - click will not execute if input isn't in the document
    document.body.appendChild(this.browseElem);

    this.uploadService.addBrowse(this.browseElem);
    this.analyticsContext.trackEvent(new MPBrowserLoaded());
  }

  public browse(): void {
    this.browseElem.click();
  }

  public teardown(): void {
    const parentNode = this.browseElem.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.browseElem);
    }
  }
}
