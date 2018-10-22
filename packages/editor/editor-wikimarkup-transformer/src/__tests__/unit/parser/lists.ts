import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Lists', () => {
  const testCases: Array<[string, string]> = [
    [
      'should find unordered lists where items start with *',
      `* some
* bullet
** *indented*
** bullets
* points`,
    ],
    [
      'should find unordered lists where items start with -',
      `- different
- bullet
- types`,
    ],
    [
      'should find unordered lists where items start with spaces',
      `- different
       - bullet
       - types`,
    ],
    [
      'should be able to create nested list with -',
      `- different
-- bullet
-- types`,
    ],
    [
      'should find ordered lists',
      `# a
# numbered
# list`,
    ],
    [
      'should find mixed ordered -> unordered lists',
      `# a
# numbered
#* with
#* nested
#* bullet
# list`,
    ],
    [
      'should find mixed unordered -> ordered lists',
      `* a
* bulleted
*# with
*# nested
*# numbered
* list`,
    ],
    ['should convert blockquotes into paragraphs', '* bq. This is sparta'],
    ['should convert headings into paragraphs', '* h1. Foo'],
    ['should convert rules into paragraphs', '* ----'],
    ['should use mediaSingle nodes', '* !attached-image.gif!'],
    [
      'should not fail for multiple lists',
      // tslint:disable-next-line:max-line-length
      "Steps to reproduce:\r\n* Type something\r\n* Type @\r\n* Type few letters\r\n* mention mark disappears \r\n\r\nExpected:\r\n* Mention mark doesn't disappear",
    ],
    [
      'should break out the media group',
      `* This is a media group [^file.pdf] and text after it`,
    ],
    [
      'should break out the media group even in nested list',
      `* nested
** media group [^file.pdf] here
** nice nice
* all good`,
    ],
    [
      'should not be a list item if it follows by a line break',
      `* nested
*
*`,
    ],
    [
      'should find the full content of a list item properly',
      `* nested
       spaces in front of me`,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
