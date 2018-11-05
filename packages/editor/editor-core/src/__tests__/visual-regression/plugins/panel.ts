import {
  initEditor,
  insertMenuSelector,
  snapshot,
  insertMenuTests,
  editable,
} from '../_utils';

const panelNodeSelector = insertMenuTests.filter(
  plugin => plugin.name === 'Panel',
)[0].nodeSelector;
const insertPanelSelector = 'span[aria-label="Panel"]';

describe('Snapshot Test: Panel', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
  });

  afterEach(async () => {
    await page.waitFor(1000);
    await snapshot(page, 0);
  });

  describe('Long link text', () => {
    it("shouldn't overflow ", async () => {
      await page.click(insertMenuSelector);

      await page.waitForSelector(insertPanelSelector);
      await page.click(insertPanelSelector);

      await page.waitForSelector(panelNodeSelector);
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.click(panelNodeSelector);
      await page.type(
        editable,
        '[Loremipsumdolorsitamet,eumtehomeroprobatusurbanitas.Euismodsingulisahas,nectalealiadelenitcu.EstcucLoremipsumdolorsitamet,eumtehomeroprobatusurbanitas.Euismodsingulisahas,nectalealiadelenitcu.Estcuc](ttps://www.atlassian.com/)',
      );
    });
  });
  describe('Long text without spaces', () => {
    it("shouldn't overflow ", async () => {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.click(insertMenuSelector);

      await page.waitForSelector(insertPanelSelector);
      await page.click(insertPanelSelector);

      await page.waitForSelector(panelNodeSelector);
      await page.click(panelNodeSelector);
      await page.type(
        editable,
        'Loremipsumdolorsitamet,eumtehomeroprobatusurbanitas.Euismodsingulisahas,nectalealiadelenitcu.EstcucLoremipsumdolorsitamet,eumtehomeroprobatusurbanitas.Euismodsingulisahas,nectalealiadelenitcu.Estcuc',
      );
    });
  });
});
