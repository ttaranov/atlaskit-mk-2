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

    this.addEvents();

    this.analyticsContext.trackEvent(new MPBrowserLoaded());
  }

  private addEvents() {
    this.browseElement.addEventListener('change', this.onFilePicked);
    // if (this.config.useNewUploadService) {
    // } else {
    //   (this.uploadService as OldUploadServiceImpl).addBrowse(
    //     this.browseElement,
    //   );
    // }
  }

  private removeEvents() {
    if (this.config.useNewUploadService) {
      this.browseElement.removeEventListener('change', this.onFilePicked);
    }
  }

  private onFilePicked = () => {
    const filesArray = [].slice.call(this.browseElement.files);
    this.uploadService.addFiles(filesArray);
  };

  public browse(): void {
    this.browseElement.click();
  }

  public teardown(): void {
    this.removeEvents();
    const parentNode = this.browseElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.browseElement);
    }
  }
}
