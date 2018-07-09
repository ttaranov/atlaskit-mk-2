import * as React from 'react';
import { ConfluenceObjectResult, ContentType } from '../model/Result';
import Objects24PageIcon from '@atlaskit/icon/glyph/objects/24/page';
import Objects24BlogIcon from '@atlaskit/icon/glyph/objects/24/blog';
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

const TYPE_MATCH_ICON_MAP = {
  'attachment-audio': FileTypes24File24AudioIcon,
  'attachment-code': FileTypes24File24SourceCodeIcon,
  'attachment-word-document': FileTypes24File24WordDocumentIcon,
  'attachment-image': FileTypes24File24ImageIcon,
  'attachment-pdf-pdf': FileTypes24File24PdfDocumentIcon,
  'attachment-presentation': FileTypes24File24PowerpointPresentationIcon,
  'attachment-spreadsheet': FileTypes24File24ExcelSpreadsheetIcon,
  'attachment-video': FileTypes24File24VideoIcon,
  'attachment-zip': FileTypes24File24ArchiveIcon,
  default: FileTypes24File24GenericIcon,
};

// ----------------- START CODE MODIFIED FROM CONFLUENCE FRONTEND ------- //
// ./packages/confluence-rest-api/src/helpers/icons.js //
const ICONS_TRANSFORMERS = {
  typeMatchers: [
    /^content-type-attachment-(.*)$/,
    /icon-file-multimedia/,
    /icon-file-image/,
    /icon-file-(unknown)/,
    /icon-file-[.?]*/,
  ],
  subTypeMatchers: {
    audio: /\.(wma|wmv|ram|mp3)$/i,
    code: /\.(xml|html|js|css|java|jar|war|ear)$/i,
    document: /\.(docx|dotx|doc|dot)$/i,
    image: /\.(gif|jpeg|jpg|png)$/i,
    pdf: /\.(pdf)$/i,
    presentation: /\.(pptx|ppsx|potx|pot|ppt|pptm)$/i,
    spreadsheet: /\.(xlt|xls|xlsm|xlsx|xlst)$/i,
    video: /\.(mov|mpeg|mpg|mp4|avi)$/i,
    zip: /\.(zip)$/i,
  },
  getType: fileType => (fileType ? `attachment-${fileType}` : 'attachment'),
};

const subTypeMatch = (subTypeRelatedStr, mapper) => {
  if (!mapper || !subTypeRelatedStr) {
    return null;
  }
  for (const matchType in mapper) {
    const isMatch = mapper[matchType].exec(subTypeRelatedStr);
    if (isMatch) {
      return matchType;
    }
  }
};

const getIconType = (iconClass: string, fileName: string) => {
  let matches;

  ICONS_TRANSFORMERS.typeMatchers.find(matchRegexp => {
    const typeMatches = matchRegexp.exec(iconClass);
    if (typeMatches) {
      matches = typeMatches;
    }
    return !!typeMatches;
  });

  if (matches && matches.length > 0) {
    const type = ICONS_TRANSFORMERS.getType(matches[1]);
    const subType = subTypeMatch(fileName, ICONS_TRANSFORMERS.subTypeMatchers);

    return subType ? `${type}-${subType}` : type;
  }

  return null;
};
// ----------------- END CODE BORROWED FROM CONFLUENCE FRONTEND ------- //

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
  <Objects24PageIcon
    size="medium"
    primaryColor={colors.B200}
    label={result.name}
  />
);

const getBlogPostIconComponentForResult = (result: ConfluenceObjectResult) => (
  <Objects24BlogIcon
    label={result.name}
    size="medium"
    primaryColor={colors.B200}
  />
);

const getDefaultAvatarComponentForResult = (result: ConfluenceObjectResult) => (
  <Avatar src={result.avatarUrl} size="small" appearance="square" />
);

export const getMediaTypeAvatarForResult = (result: ConfluenceObjectResult) => {
  const iconType = getIconType(result.iconClass!, result.name);

  const IconComponent = iconType
    ? TYPE_MATCH_ICON_MAP[iconType]
    : TYPE_MATCH_ICON_MAP.default;

  return <IconComponent label={result.name} size="small" />;
};
