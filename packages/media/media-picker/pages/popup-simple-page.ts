import { Client } from 'webdriverio';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

/**
 * Popup Simple Example Page Object
 * @see https://www.seleniumhq.org/docs/06_test_design_considerations.jsp#page-object-design-pattern
 */
export class PopupSimplePage {
  constructor(private readonly client: Client<any>) {}

  async go() {
    const url = getExampleUrl('media', 'media-picker', 'popup-simple');
    await this.client.url(url);
  }

  getUploadButton() {
    return this.client.$('//button[contains(., "Upload a file")]');
  }

  getRecentUploadCards() {
    return this.client.$$('.recent-upload-card');
  }

  getRecentUploadCard(filename: string) {
    return this.client.$(`//div[contains(., "${filename}")]`);
  }

  async uploadFile(localPath: string) {
    await this.getUploadButton().then();
    await this.client.chooseFile('input', localPath);
  }
}

export async function gotoPopupSimplePage(
  client: Client<any>,
): Promise<PopupSimplePage> {
  const page = new PopupSimplePage(client);
  await page.go();
  return page;
}
