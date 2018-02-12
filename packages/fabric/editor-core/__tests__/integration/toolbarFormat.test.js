import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const editors = [
  {
    name: 'comment',
    path: `${global.__baseUrl__}/examples/fabric/editor-core/comment`,
    placeholder: '[placeholder="What do you want to say?"]',
  },
  {
    name: 'fullpage',
    path: `${global.__baseUrl__}/examples/fabric/editor-core/full-page`,
    placeholder: 'p',
  },
];
const editable = '[contenteditable="true"]';
const input = 'HELLO_WORLD';

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select normal text style for ${editor.name} editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.click(editor.placeholder);
      await sample.type(editable, input);
      await sample.click('[aria-label="Change formatting"]');
      await sample.click('span=Normal text');
      expect(await sample.getText('p')).toContain(input);
    },
  );
});

editors.forEach(editor => {
  for (let i = 1; i <= 6; i++) {
    BrowserTestCase(
      `User should be able to select heading${i} for ${editor.name} editor`,
      { skip: ['edge', 'ie', 'safari'] },
      async client => {
        const sample = await new Page(client);
        await sample.goto(editor.path);
        await sample.click(editor.placeholder);
        await sample.type(editable, input);
        await sample.click('[aria-label="Change formatting"]');
        await sample.click(`span=Heading ${i}`);
        expect(await sample.getText(`h${i}`)).toContain(input);
      },
    );
  }
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Bold on toolbar for ${editor.name} editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.click(editor.placeholder);
      await sample.click('[aria-label="Bold"]');
      await sample.type(editable, input);
      expect(await sample.getText('strong')).toContain(input);
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Italic on toolbar for ${editor.name} editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.click(editor.placeholder);
      await sample.click('[aria-label="Italic"]');
      await sample.type(editable, input);
      expect(await sample.getText('em')).toContain(input);
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Underline on toolbar for ${
      editor.name
    } editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.click(editor.placeholder);
      await sample.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await sample.click(`span=Underline`);
      await sample.type(editable, input);
      expect(await sample.getText('u')).toContain(input);
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Clear Formatting on toolbar for ${
      editor.name
    } editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.click(editor.placeholder);
      await sample.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await sample.click(`span=Underline`);
      await sample.type(editable, 'test');
      await sample.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await sample.click(`span=Clear Formatting`);
      await sample.type(editable, 'cleared');
      expect(await sample.getText('u')).not.toContain('testcleared');
    },
  );
});
