import { ConfluenceObjectResult, ContentType } from '../model/Result';
import * as React from 'react';
import Objects24PageIcon from '@atlaskit/icon/glyph/objects/24/page';
import Objects24BlogIcon from '@atlaskit/icon/glyph/objects/24/blog';
import Avatar from '@atlaskit/avatar';

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

  if (matches && matches.length > 1) {
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
    size="medium"
    primaryColor={colors.B200}
    label={result.name}
  />
);

const getDefaultAvatarComponentForResult = (result: ConfluenceObjectResult) => (
  <Avatar src={result.avatarUrl} size="small" appearance="square" />
);

export const getMediaTypeAvatarForResult = (result: ConfluenceObjectResult) => {
  const iconType = getIconType(result.iconClass!, result.name);

  // MEGA CASE STATEMENT!!
  return iconType;
};
