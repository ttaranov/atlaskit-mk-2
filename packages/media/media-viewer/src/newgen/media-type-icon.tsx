/* tslint:disable:variable-name */
import * as React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/media-services/document';
import UnknownIcon from '@atlaskit/icon/glyph/media-services/unknown';
import { MediaType } from '@atlaskit/media-core';
import { IconWrapper } from './styled';

const icons = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  unknown: UnknownIcon,
};

export interface FileIconProps {
  type?: MediaType;
}

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  static defaultProps: FileIconProps = {
    type: 'unknown',
  };

  render() {
    const { type } = this.props;
    const Icon = icons[type!];

    return (
      <IconWrapper type={type!}>
        <Icon label="media-type" size="large" />
      </IconWrapper>
    );
  }
}
