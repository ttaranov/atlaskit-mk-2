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
  private browseElem: HTMLElement;

  constructor(
    context: MediaPickerContext,
    config: ModuleConfig,
    browserConfig: BrowserConfig = {},
  ) {
    super(context, config);

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
    this.browseElem.addEventListener('change', this.onChange);
    // this.uploadService.addBrowse(this.browseElem);
    this.context.trackEvent(new MPBrowserLoaded());
  }

  onChange(e: Event) {
    const { currentTarget } = e;
    const files = (currentTarget as HTMLInputElement).files;

    this.uploadService2.addFiles(Array.from(files));
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
