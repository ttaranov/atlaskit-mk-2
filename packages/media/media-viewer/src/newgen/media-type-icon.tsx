/* tslint:disable:variable-name */
import * as React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import VideoIcon from '@atlaskit/icon/glyph/media-services/video';
import DocIcon from '@atlaskit/icon/glyph/media-services/document';
import UnknownIcon from '@atlaskit/icon/glyph/media-services/unknown';
import { IconWrapper } from './styled';

const icons = {
  image: ImageIcon,
  audio: AudioIcon,
  video: VideoIcon,
  doc: DocIcon,
  unknown: UnknownIcon,
};

export interface FileIconProps {
  type?: string;
}

export class MediaTypeIcon extends React.Component<FileIconProps, {}> {
  render() {
    const { type } = this.props;
    const Icon = (type && icons[type]) || icons.unknown;
    return (
      <IconWrapper type={type || 'unknown'}>
        <Icon label="media-type" size="large" />
      </IconWrapper>
    );
  }
}
