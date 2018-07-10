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
  const avatar = getAvatarForConfluenceObjectResult(result);
  return shallow(avatar);
}

function assertAvatarCorrectness(wrapper, filename, mock) {
  expect(wrapper.type()).toBe(mock);
  expect(wrapper.prop('size')).toBe('medium');
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

  function describeTestGroup(
    groupType,
    testExtensions,
    cqlIconClass,
    quickNavIconClass,
    expectedMock,
  ) {
    describe(`${groupType} attachments`, () => {
      const testCases = generateTestCasesForExtensions(testExtensions);
      testCases.forEach(testFileName => {
        it(`file name should be correctly mapped to the ${groupType} attachment icon: ${testFileName}`, () => {
          executeTest(testFileName, cqlIconClass, expectedMock);
          executeTest(testFileName, quickNavIconClass, expectedMock);
        });
      });
    });
  }

  [
    {
      id: 'audio',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-multimedia',
      extensions: ['wma', 'wmv', 'ram', 'mp3'],
      expectedMock: 'MockAudio',
    },
    {
      id: 'code',
      quickNavIconClass: 'content-type-attachment-code',
      cqlIconClass: 'icon-file-code',
      extensions: ['xml', 'html', 'js', 'css', 'java', 'jar', 'war', 'ear'],
      expectedMock: 'MockSourceCode',
    },
    {
      id: 'document',
      quickNavIconClass: 'content-type-attachment-document',
      cqlIconClass: 'icon-file-document',
      extensions: ['docx', 'dotx', 'doc', 'dot'],
      expectedMock: 'MockDocument',
    },
    {
      id: 'pdf',
      quickNavIconClass: 'content-type-attachment-pdf',
      cqlIconClass: 'icon-file-pdf',
      extensions: ['pdf'],
      expectedMock: 'MockPdf',
    },
    {
      id: 'presentation',
      quickNavIconClass: 'content-type-attachment-presentation',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['pptx', 'ppsx', 'potx', 'pot', 'ppt', 'pptm'],
      expectedMock: 'MockPresentation',
    },
    {
      id: 'spreadsheet',
      quickNavIconClass: 'content-type-attachment-excel',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['xlt', 'xls', 'xlsm', 'xlsx', 'xlst'],
      expectedMock: 'MockSpreadsheet',
    },
    {
      id: 'video',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-video',
      extensions: ['mov', 'mpeg', 'mpg', 'mp4', 'avi'],
      expectedMock: 'MockVideo',
    },
    {
      id: 'zip',
      quickNavIconClass: 'content-type-attachment-zip',
      cqlIconClass: 'icon-file-zip',
      extensions: ['zip'],
      expectedMock: 'MockArchive',
    },
    {
      id: 'generic',
      quickNavIconClass: 'dummy-unmatched-icon-class',
      cqlIconClass: 'dummy-unmatched-icon-class',
      extensions: ['unknown', 'test'],
      expectedMock: 'MockGeneric',
    },
  ].forEach(testGroup => {
    describeTestGroup(
      testGroup.id,
      testGroup.extensions,
      testGroup.cqlIconClass,
      testGroup.quickNavIconClass,
      testGroup.expectedMock,
    );
  });
});
