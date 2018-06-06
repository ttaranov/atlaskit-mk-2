import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import { ResultBase } from '@atlaskit/quick-search';
import { ResultContentType } from '../model/Result';
import Objects24PageIcon from '@atlaskit/icon/glyph/objects/24/page';
import Objects24BlogIcon from '@atlaskit/icon/glyph/objects/24/blog';
import Objects24ImageIcon from '@atlaskit/icon/glyph/objects/24/image';

const OBJECT_RESULT_TYPE = 'object';

export interface Props {
  name: string;
  containerName: string;
  avatarUrl?: string;
  objectKey?: string;
  contentType?: ResultContentType;
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
   */
  getAvatar = () => {
    if (this.props.contentType === ResultContentType.Page) {
      return <Objects24PageIcon size="medium" label={this.props.name} />;
    } else if (this.props.contentType === ResultContentType.Blogpost) {
      return <Objects24BlogIcon size="medium" label={this.props.name} />;
    } else if (this.props.contentType === ResultContentType.Attachment) {
      return <Objects24ImageIcon size="medium" label={this.props.name} />;
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
