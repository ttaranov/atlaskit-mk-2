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

export interface ExtensionMatcher {
  regexp: RegExp;
  avatar: any; // can't seem to find a type that doesn't complain here.
}

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

const DEFAULT_ATTACHMENT_AVATAR = FileTypes24File24GenericIcon;
const ATTACHMENT_FILE_EXTENSION_MATCHERS: ExtensionMatcher[] = [
  {
    regexp: /\.(gif|jpeg|jpg|png)$/i,
    avatar: FileTypes24File24ImageIcon,
  },
  {
    regexp: /\.(pdf)$/i,
    avatar: FileTypes24File24PdfDocumentIcon,
  },
  {
    regexp: /\.(docx|dotx|doc|dot)$/i,
    avatar: FileTypes24File24WordDocumentIcon,
  },
  {
    regexp: /\.(xml|html|js|css|java|jar|war|ear)$/i,
    avatar: FileTypes24File24SourceCodeIcon,
  },
  {
    regexp: /\.(xlt|xls|xlsm|xlsx|xlst)$/i,
    avatar: FileTypes24File24ExcelSpreadsheetIcon,
  },
  {
    regexp: /\.(wma|wmv|ram|mp3)$/i,
    avatar: FileTypes24File24AudioIcon,
  },
  {
    regexp: /\.(pptx|ppsx|potx|pot|ppt|pptm)$/i,
    avatar: FileTypes24File24PowerpointPresentationIcon,
  },
  {
    regexp: /\.(mov|mpeg|mpg|mp4|avi)$/i,
    avatar: FileTypes24File24VideoIcon,
  },
  {
    regexp: /\.(zip)$/i,
    avatar: FileTypes24File24ArchiveIcon,
  },
];

const getIconType = (iconClass: string, fileName: string) => {
  // Check the iconClass to make sure we're looking at an attachment
  const prefixMatches = ATTACHMENT_ICON_CLASS_PREFIXES.find(prefix => {
    return iconClass.startsWith(prefix);
  });

  // if it's an attachment, look at the file extension to work out which type
  if (prefixMatches) {
    const matchingType:
      | ExtensionMatcher
      | undefined = ATTACHMENT_FILE_EXTENSION_MATCHERS.find(
      (extensionMatcher: ExtensionMatcher) => {
        const matches = extensionMatcher.regexp.exec(fileName);
        return !!matches && matches.length > 0;
      },
    );

    if (matchingType) {
      return matchingType.avatar;
    }
  }

  return DEFAULT_ATTACHMENT_AVATAR;
};

export const getAvatarForConfluenceObjectResult = (
  result: ConfluenceObjectResult,
) => {
  if (result.contentType === ContentType.ConfluencePage) {
    return (
      <Objects24Object24PageIcon
        size="medium"
        primaryColor={colors.B200}
        label={result.name}
      />
    );
  } else if (result.contentType === ContentType.ConfluenceBlogpost) {
    return (
      <Objects24Object24BlogIcon
        label={result.name}
        size="medium"
        primaryColor={colors.B200}
      />
    );
  } else if (result.contentType === ContentType.ConfluenceAttachment) {
    return getMediaTypeAvatarForResult(result);
  } else {
    return <Avatar src={result.avatarUrl} size="medium" appearance="square" />;
  }
};

export const getMediaTypeAvatarForResult = (result: ConfluenceObjectResult) => {
  const IconComponent = getIconType(result.iconClass!, result.name);

  return <IconComponent label={result.name} size="medium" />;
};
