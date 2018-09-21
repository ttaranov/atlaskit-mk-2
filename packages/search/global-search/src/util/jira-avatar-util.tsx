import * as React from 'react';
import BoardIcon from '@atlaskit/icon/glyph/board';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import { ContentType } from '../model/Result';

const getIconComponent = (contentType?: ContentType) => {
  if (!contentType) {
    return null;
  }
  switch (contentType) {
    case ContentType.JiraIssue:
      return IssueIcon;
    case ContentType.JiraBoard:
      return BoardIcon;
    case ContentType.JiraFilter:
      return FilterIcon;
  }
  return null;
};
export const getDefaultAvatar = (contentType?: ContentType) => {
  const IconComponent = getIconComponent(contentType);
  return IconComponent ? (
    <IconComponent label={contentType || ''} size="medium" />
  ) : null;
};
