import { LocalUploadComponent } from './localUpload';
import { MPBrowserLoaded } from '../outer/analytics/events';
import { ModuleConfig } from '../domain/config';
import { MediaPickerContext } from '../domain/context';

export interface BrowserConfig {
  multiple?: boolean;
  fileExtensions?: Array<string>;
}

export interface BrowserConstructor {
  new (
    context: MediaPickerContext,
    config: ModuleConfig,
    browserConfig: BrowserConfig,
  ): Browser;
}

export class Browser extends LocalUploadComponent {
  private readonly browseElement: HTMLInputElement;

  constructor(
    context: MediaPickerContext,
    config: ModuleConfig,
    browserConfig: BrowserConfig = {},
  ) {
    super(context, config);

    this.browseElement = document.createElement('INPUT') as HTMLInputElement;
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
    this.context.trackEvent(new MPBrowserLoaded());
  }

  public browse(): void {
    this.browseElement.click();
  }

  public teardown(): void {
    const parentNode = this.browseElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.browseElement);
    }
  }
}
