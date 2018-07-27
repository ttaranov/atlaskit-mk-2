import * as React from 'react';
import { makeConfluenceObjectResult } from './_test-util';
import { ContentType } from '../../../src/model/Result';
import FileTypes24File24ImageIcon from '@atlaskit/icon/glyph/file-types/24/file-24-image';
import FileTypes24File24ExcelSpreadsheetIcon from '@atlaskit/icon/glyph/file-types/24/file-24-excel-spreadsheet';
import FileTypes24File24VideoIcon from '@atlaskit/icon/glyph/file-types/24/file-24-video';
import FileTypes24File24ArchiveIcon from '@atlaskit/icon/glyph/file-types/24/file-24-archive';
import FileTypes24File24PowerpointPresentationIcon from '@atlaskit/icon/glyph/file-types/24/file-24-powerpoint-presentation';
import FileTypes24File24SourceCodeIcon from '@atlaskit/icon/glyph/file-types/24/file-24-source-code';
import FileTypes24File24AudioIcon from '@atlaskit/icon/glyph/file-types/24/file-24-audio';
import FileTypes24File24WordDocumentIcon from '@atlaskit/icon/glyph/file-types/24/file-24-word-document';
import FileTypes24File24PdfDocumentIcon from '@atlaskit/icon/glyph/file-types/24/file-24-pdf-document';
import FileTypes24File24GenericIcon from '@atlaskit/icon/glyph/file-types/24/file-24-generic';

import { getAvatarForConfluenceObjectResult } from '../../../src/util/confluence-avatar-util';

const TEST_FILE_PREFIXES = [
  '',
  'test123',
  '©©©!@#$%^&*()',
  'test.zip',
  'test.jpeg',
];

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

describe('confluence-avatar-util', () => {
  function executeTest(fileName, iconClass, ExpectedAvatar) {
    const confluenceResult = makeConfluenceObjectResult({
      contentType: ContentType.ConfluenceAttachment,
      name: fileName,
      iconClass: iconClass,
    });

    // assert correct icon is returned with correct props
    const avatar = getAvatarForConfluenceObjectResult(confluenceResult);
    expect(avatar).toEqual(<ExpectedAvatar label={fileName} size="medium" />);
  }

  function describeTestGroup(
    groupType,
    testExtensions,
    cqlIconClass,
    quickNavIconClass,
    expectedAvatar,
  ) {
    describe(`${groupType} attachments`, () => {
      const testCases = generateTestCasesForExtensions(testExtensions);
      testCases.forEach(testFileName => {
        it(`file name should be correctly mapped to the ${groupType} attachment icon: ${testFileName}`, () => {
          executeTest(testFileName, cqlIconClass, expectedAvatar);
          executeTest(testFileName, quickNavIconClass, expectedAvatar);
        });
      });
    });
  }

  [
    {
      id: 'image',
      quickNavIconClass: 'content-type-attachment-image',
      cqlIconClass: 'icon-file-image',
      extensions: ['gif', 'jpeg', 'jpg', 'png'],
      expectedAvatar: FileTypes24File24ImageIcon,
    },
    {
      id: 'audio',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-multimedia',
      extensions: ['wma', 'wmv', 'ram', 'mp3'],
      expectedAvatar: FileTypes24File24AudioIcon,
    },
    {
      id: 'code',
      quickNavIconClass: 'content-type-attachment-code',
      cqlIconClass: 'icon-file-code',
      extensions: ['xml', 'html', 'js', 'css', 'java', 'jar', 'war', 'ear'],
      expectedAvatar: FileTypes24File24SourceCodeIcon,
    },
    {
      id: 'document',
      quickNavIconClass: 'content-type-attachment-document',
      cqlIconClass: 'icon-file-document',
      extensions: ['docx', 'dotx', 'doc', 'dot'],
      expectedAvatar: FileTypes24File24WordDocumentIcon,
    },
    {
      id: 'pdf',
      quickNavIconClass: 'content-type-attachment-pdf',
      cqlIconClass: 'icon-file-pdf',
      extensions: ['pdf'],
      expectedAvatar: FileTypes24File24PdfDocumentIcon,
    },
    {
      id: 'presentation',
      quickNavIconClass: 'content-type-attachment-presentation',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['pptx', 'ppsx', 'potx', 'pot', 'ppt', 'pptm'],
      expectedAvatar: FileTypes24File24PowerpointPresentationIcon,
    },
    {
      id: 'spreadsheet',
      quickNavIconClass: 'content-type-attachment-excel',
      cqlIconClass: 'icon-file-presentation',
      extensions: ['xlt', 'xls', 'xlsm', 'xlsx', 'xlst'],
      expectedAvatar: FileTypes24File24ExcelSpreadsheetIcon,
    },
    {
      id: 'video',
      quickNavIconClass: 'content-type-attachment-multimedia',
      cqlIconClass: 'icon-file-video',
      extensions: ['mov', 'mpeg', 'mpg', 'mp4', 'avi'],
      expectedAvatar: FileTypes24File24VideoIcon,
    },
    {
      id: 'zip',
      quickNavIconClass: 'content-type-attachment-zip',
      cqlIconClass: 'icon-file-zip',
      extensions: ['zip'],
      expectedAvatar: FileTypes24File24ArchiveIcon,
    },
    {
      id: 'generic',
      quickNavIconClass: 'dummy-unmatched-icon-class',
      cqlIconClass: 'dummy-unmatched-icon-class',
      extensions: ['unknown', 'test'],
      expectedAvatar: FileTypes24File24GenericIcon,
    },
  ].forEach(testGroup => {
    describeTestGroup(
      testGroup.id,
      testGroup.extensions,
      testGroup.cqlIconClass,
      testGroup.quickNavIconClass,
      testGroup.expectedAvatar,
    );
  });
});
