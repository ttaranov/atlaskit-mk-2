import * as React from 'react';
import { ConfluenceObjectResult, ContentType } from '../model/Result';
import Objects24Object24PageIcon from '@atlaskit/icon/glyph/objects/24/object-24-page';
import Objects24Object24BlogIcon from '@atlaskit/icon/glyph/objects/24/object-24-blog';
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

import Avatar from '@atlaskit/avatar';
import { colors } from '@atlaskit/theme';

const ATTACHMENT_TYPE_MATCH_ICON_MAP = {
  audio: FileTypes24File24AudioIcon,
  code: FileTypes24File24SourceCodeIcon,
  document: FileTypes24File24WordDocumentIcon,
  image: FileTypes24File24ImageIcon,
  pdf: FileTypes24File24PdfDocumentIcon,
  presentation: FileTypes24File24PowerpointPresentationIcon,
  spreadsheet: FileTypes24File24ExcelSpreadsheetIcon,
  video: FileTypes24File24VideoIcon,
  zip: FileTypes24File24ArchiveIcon,

  // default
  default: FileTypes24File24GenericIcon,
};

/**
 * The following code was derived from an implementation in confluence-frontend,
 * although it differs substantially.
 *
 * The original can be found at ./packages/confluence-rest-api/src/helpers/icons.js
 */
const ATTACHMENT_ICON_CLASS_PREFIXES = [
  // Quick Nav prefix
  'content-type-attachment-',
  // CQL prefix
  'icon-file-',
];

const ATTACHMENT_FILE_EXTENSION_MATCHERS = {
  audio: /\.(wma|wmv|ram|mp3)$/i,
  code: /\.(xml|html|js|css|java|jar|war|ear)$/i,
  document: /\.(docx|dotx|doc|dot)$/i,
  image: /\.(gif|jpeg|jpg|png)$/i,
  pdf: /\.(pdf)$/i,
  presentation: /\.(pptx|ppsx|potx|pot|ppt|pptm)$/i,
  spreadsheet: /\.(xlt|xls|xlsm|xlsx|xlst)$/i,
  video: /\.(mov|mpeg|mpg|mp4|avi)$/i,
  zip: /\.(zip)$/i,
};

const getIconType = (iconClass: string, fileName: string) => {
  // Check the iconClass to make sure we're looking at an attachment
  const prefixMatches = ATTACHMENT_ICON_CLASS_PREFIXES.find(prefix => {
    return iconClass.startsWith(prefix);
  });

  // if it's an attachment, look at the file extension to work out which type
  if (prefixMatches) {
    const attachmentTypes = Object.keys(ATTACHMENT_FILE_EXTENSION_MATCHERS);
    const matchingType = attachmentTypes.find(attachmentType => {
      const extensionMatcher =
        ATTACHMENT_FILE_EXTENSION_MATCHERS[attachmentType];
      return extensionMatcher.exec(fileName);
    });

    return matchingType;
  }

  return null;
};

export const getAvatarForConfluenceObjectResult = (
  result: ConfluenceObjectResult,
) => {
  if (result.contentType === ContentType.ConfluencePage) {
    return getPageIconComponentForResult(result);
  } else if (result.contentType === ContentType.ConfluenceBlogpost) {
    return getBlogPostIconComponentForResult(result);
  } else if (result.contentType === ContentType.ConfluenceAttachment) {
    return getMediaTypeAvatarForResult(result);
  } else {
    return getDefaultAvatarComponentForResult(result);
  }
};

const getPageIconComponentForResult = (result: ConfluenceObjectResult) => (
  <Objects24Object24PageIcon
    size="medium"
    primaryColor={colors.B200}
    label={result.name}
  />
);

const getBlogPostIconComponentForResult = (result: ConfluenceObjectResult) => (
  <Objects24Object24BlogIcon
    label={result.name}
    size="medium"
    primaryColor={colors.B200}
  />
);

const getDefaultAvatarComponentForResult = (result: ConfluenceObjectResult) => (
  <Avatar src={result.avatarUrl} size="medium" appearance="square" />
);

export const getMediaTypeAvatarForResult = (result: ConfluenceObjectResult) => {
  const iconType = getIconType(result.iconClass!, result.name);

  const IconComponent = iconType
    ? ATTACHMENT_TYPE_MATCH_ICON_MAP[iconType]
    : ATTACHMENT_TYPE_MATCH_ICON_MAP.default;

  return <IconComponent label={result.name} size="medium" />;
};
