import { LocalUploadComponent, LocalUploadConfig } from './localUpload';
import { MPBrowserLoaded } from '../outer/analytics/events';
import { MediaPickerContext } from '../domain/context';
import { Context } from '@atlaskit/media-core';

export interface BrowserConfig extends LocalUploadConfig {
  readonly multiple?: boolean;
  readonly fileExtensions?: Array<string>;
}

export interface BrowserConstructor {
  new (
    analyticsContext: MediaPickerContext,
    context: Context,
    browserConfig: BrowserConfig,
  ): Browser;
}

export class Browser extends LocalUploadComponent {
  private readonly browseElement: HTMLInputElement;

  constructor(
    analyticsContext: MediaPickerContext,
    context: Context,
    browserConfig: BrowserConfig = { uploadParams: {} },
  ) {
    super(analyticsContext, context, browserConfig);

    this.browseElement = document.createElement('input');
    this.browseElement.setAttribute('type', 'file');
    this.browseElement.style.display = 'none';

    if (browserConfig.multiple) {
      this.browseElement.setAttribute('multiple', '');
    }

    if (browserConfig.fileExtensions) {
      this.browseElement.setAttribute(
        'accept',
        browserConfig.fileExtensions.join(','),
      );
    }

    // IE11 hack - click will not execute if input has no parent
    // WebDriver hack - click will not execute if input isn't in the document
    document.body.appendChild(this.browseElement);

    this.uploadService.addBrowse(this.browseElement);
    this.analyticsContext.trackEvent(new MPBrowserLoaded());
  }

  public browse(): void {
    this.browseElement.click();
  }

  public teardown(): void {
    this.uploadService.removeBrowse();
    const parentNode = this.browseElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.browseElement);
    }
  }
}
