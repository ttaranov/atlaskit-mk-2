import { makeConfluenceObjectResult } from './_test-util';
import { ContentType } from '../src/model/Result';
import { shallow } from 'enzyme';

function mock(module, mockName) {
  jest.mock(module, () => {
    return {
      default: mockName,
    };
  });
}

mock('@atlaskit/icon/glyph/file-types/24/file-24-image', 'MockImage');
mock(
  '@atlaskit/icon/glyph/file-types/24/file-24-excel-spreadsheet',
  'MockSpreadsheet',
);
mock('@atlaskit/icon/glyph/file-types/24/file-24-video', 'MockVideo');
mock('@atlaskit/icon/glyph/file-types/24/file-24-archive', 'MockArchive');
mock(
  '@atlaskit/icon/glyph/file-types/24/file-24-powerpoint-presentation',
  'MockPresentation',
);
mock(
  '@atlaskit/icon/glyph/file-types/24/file-24-source-code',
  'MockSourceCode',
);
mock('@atlaskit/icon/glyph/file-types/24/file-24-audio', 'MockAudio');
mock(
  '@atlaskit/icon/glyph/file-types/24/file-24-word-document',
  'MockDocument',
);
mock('@atlaskit/icon/glyph/file-types/24/file-24-pdf-document', 'MockPdf');
mock('@atlaskit/icon/glyph/file-types/24/file-24-generic', 'MockGeneric');

import { getAvatarForConfluenceObjectResult } from '../src/util/confluence-avatar-util';

const TEST_FILE_PREFIXES = ['', 'test123', '©©©!@#$%^&*()'];

/**
 * Given a list of file extensions, return an array of test filenames containing
 * those file extensions to test against.
 */
function generateTestCasesForExtensions(extensionsToTest) {
  // generate a 2d array of filenames
  const tests = extensionsToTest.map(extension => {
    return TEST_FILE_PREFIXES.map(prefix => `${prefix}.${extension}`);
  });
  // flatten the array, done
  return [].concat(...tests);
}

function renderAvatarForResult(result) {
  return shallow(getAvatarForConfluenceObjectResult(result));
}

function assertAvatarCorrectness(wrapper, filename, mock) {
  expect(wrapper.type()).toBe(mock);
  expect(wrapper.prop('size')).toBe('small');
  expect(wrapper.prop('label')).toBe(filename);
}

describe('confluence-avatar-util', () => {
  function executeTest(fileName, iconClass, expectedMock) {
    const confluenceResult = makeConfluenceObjectResult({
      contentType: ContentType.ConfluenceAttachment,
      name: fileName,
      iconClass: iconClass,
    });

    const wrapper = renderAvatarForResult(confluenceResult);

    assertAvatarCorrectness(wrapper, fileName, expectedMock);
  }

  describe('image attachments', () => {
    const imageTestCases = generateTestCasesForExtensions([
      'png',
      'gif',
      'jpg',
      'jpeg',
    ]);
    imageTestCases.forEach(testFileName => {
      it(`file name should be correctly mapped to the image attachment icon: ${testFileName}`, () => {
        executeTest(testFileName, 'icon-file-image', 'MockImage');
      });
    });
  });

  describe('audio attachments', () => {
    const audioTestCases = generateTestCasesForExtensions([
      'wma',
      'ram',
      'wmv',
      'mp3',
    ]);
    audioTestCases.forEach(testFileName => {
      it(`file name should be correctly mapped to the audio attachment icon: ${testFileName}`, () => {
        executeTest(testFileName, 'icon-file-multimedia', 'MockAudio');
      });
    });
  });

  describe('pdf attachments', () => {
    const audioTestCases = generateTestCasesForExtensions(['pdf']);
    audioTestCases.forEach(testFileName => {
      it(`file name should be correctly mapped to the pdf attachment icon: ${testFileName}`, () => {
        executeTest(testFileName, 'content-type-attachment-pdf', 'MockPdf');
      });
    });
  });

  describe('word document attachments', () => {
    const audioTestCases = generateTestCasesForExtensions([
      'docx',
      'dotx',
      'doc',
      'dot',
    ]);
    audioTestCases.forEach(testFileName => {
      it(`file name should be correctly mapped to the word document attachment icon: ${testFileName}`, () => {
        executeTest(
          testFileName,
          'content-type-attachment-word',
          'MockDocument',
        );
      });
    });
  });
});
