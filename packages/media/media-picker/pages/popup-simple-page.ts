import { Client } from 'webdriverio';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { PopupUploadEventPayloadMap } from '../src/components/popup';

export type Event = {
  readonly name: string;
  readonly payload: any;
};

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

  getInsertButton() {
    return this.client.$('.insert-button');
  }

  async getEvents(): Promise<Event[]> {
    return JSON.parse(await this.client.getText('#events'));
  }

  async getEvent(name: keyof PopupUploadEventPayloadMap): Promise<Event> {
    await this.client.waitUntil(
      async () => (await this.getEvents()).some(isEvent(name)),
      3000,
    );

    const events = await this.getEvents();

    const event = events.find(isEvent(name));
    if (event) {
      return event;
    } else {
      throw new Error(`Event ${name} not found`);
    }
  }

  async uploadFile(localPath: string) {
    await this.getUploadButton().click();
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

function isEvent(name: string) {
  return (event: Event) => event.name === name;
}
