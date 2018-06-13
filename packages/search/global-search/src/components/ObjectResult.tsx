import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import { ResultBase } from '@atlaskit/quick-search';
import { ResultContentType } from '../model/Result';
import Objects24PageIcon from '@atlaskit/icon/glyph/objects/24/page';
import Objects24BlogIcon from '@atlaskit/icon/glyph/objects/24/blog';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

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

  getAvatar = () => {
    if (this.props.contentType === ResultContentType.Page) {
      return <Objects24PageIcon size="large" label={this.props.name} />;
    } else if (this.props.contentType === ResultContentType.Blogpost) {
      return <Objects24BlogIcon size="large" label={this.props.name} />;
    } else if (this.props.contentType === ResultContentType.Attachment) {
      return <DocumentFilledIcon size="large" label={this.props.name} />;
    } else {
      return <Avatar src={this.props.avatarUrl} appearance="square" />;
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
