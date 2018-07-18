import { LocalUploadComponent, LocalUploadConfig } from './localUpload';
import { Context } from '@atlaskit/media-core';

export interface BrowserConfig extends LocalUploadConfig {
  readonly multiple?: boolean;
  readonly fileExtensions?: Array<string>;
}

export interface BrowserConstructor {
  new (context: Context, browserConfig: BrowserConfig): Browser;
}

export class Browser extends LocalUploadComponent {
  private readonly browseElement: HTMLInputElement;

  constructor(
    context: Context,
    browserConfig: BrowserConfig = { uploadParams: {} },
  ) {
    super(context, browserConfig);

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
  }

  private addEvents() {
    this.browseElement.addEventListener('change', this.onFilePicked);
  }

  private removeEvents() {
    this.browseElement.removeEventListener('change', this.onFilePicked);
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
