import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import { colors } from '@atlaskit/theme';
import { ResultBase } from '@atlaskit/quick-search';
import { ContentType, AnalyticsType } from '../model/Result';
import Objects24PageIcon from '@atlaskit/icon/glyph/objects/24/object-24-page';
import Objects24BlogIcon from '@atlaskit/icon/glyph/objects/24/object-24-blog';
import Objects24ImageIcon from '@atlaskit/icon/glyph/file-types/24/file-24-image';

const OBJECT_RESULT_TYPE = 'object';

export interface Props {
  name: string;
  containerName: string;
  resultId: string;
  avatarUrl?: string;
  objectKey?: string;
  contentType?: ContentType;
  href?: string;
  type?: AnalyticsType;
}

/**
 * Copy of ObjectResult.js from navigation/quick-search but with a custom subText.
 */
export default class ObjectResult extends React.Component<Props> {
  static defaultProps = {
    isCompact: false,
    isSelected: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    type: OBJECT_RESULT_TYPE,
  };

  /*
   * Note:
   * Icon with medium size = 24px.
   * Avatar with small size = 24px.
   * 
   * Colors come from: https://extranet.atlassian.com/display/ADG/Object+icons%3A+Colors
   */
  getAvatar = () => {
    if (this.props.contentType === ContentType.ConfluencePage) {
      return (
        <Objects24PageIcon
          size="medium"
          primaryColor={colors.B200}
          label={this.props.name}
        />
      );
    } else if (this.props.contentType === ContentType.ConfluenceBlogpost) {
      return (
        <Objects24BlogIcon
          size="medium"
          primaryColor={colors.B200}
          label={this.props.name}
        />
      );
    } else if (this.props.contentType === ContentType.ConfluenceAttachment) {
      return (
        <Objects24ImageIcon
          size="medium"
          primaryColor={colors.R300}
          label={this.props.name}
        />
      );
    } else {
      return (
        <Avatar src={this.props.avatarUrl} size="small" appearance="square" />
      );
    }
  };

  getSubtext() {
    const { objectKey, containerName } = this.props;

    if (objectKey) {
      return `${objectKey} · ${containerName}`;
    } else {
      return containerName;
    }
  }

  render() {
    const { name, ...resultBaseProps } = this.props;
    return (
      <ResultBase
        {...resultBaseProps}
        icon={this.getAvatar()}
        subText={this.getSubtext()}
        text={name}
      />
    );
  }
}
