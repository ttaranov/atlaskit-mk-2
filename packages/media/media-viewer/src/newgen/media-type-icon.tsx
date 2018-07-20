/* tslint:disable:variable-collectionName */
import * as React from 'react';
import FileTypes24File24ImageIcon from '@atlaskit/icon/glyph/file-types/24/file-24-image';
import FileTypes24File24AudioIcon from '@atlaskit/icon/glyph/file-types/24/file-24-audio';
import FileTypes24File24VideoIcon from '@atlaskit/icon/glyph/file-types/24/file-24-video';
import FileTypes24File24DocumentIcon from '@atlaskit/icon/glyph/file-types/24/file-24-document';
import FileTypes24File24GenericIcon from '@atlaskit/icon/glyph/file-types/24/file-24-generic';
import { MediaType } from '@atlaskit/media-core';
import { IconWrapper } from './styled';

const icons = {
  image: FileTypes24File24ImageIcon,
  audio: FileTypes24File24AudioIcon,
  video: FileTypes24File24VideoIcon,
  doc: FileTypes24File24DocumentIcon,
  unknown: FileTypes24File24GenericIcon,
};

export interface FileIconProps {
  type?: MediaType;
}

const defaultType = 'unknown';

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  static defaultProps: FileIconProps = {
    type: defaultType,
  };

  render() {
    const { type } = this.props;
    const typeWithDefault = type || defaultType;
    const Icon = icons[typeWithDefault] || icons[defaultType];

    return (
      <IconWrapper type={typeWithDefault}>
        <Icon secondaryColor="#fff" label="media-type" size="medium" />
      </IconWrapper>
    );
  }
}
