import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { FileViewer, FileDetails } from './file-viewer';

export type Props = {
  onClose?: () => void;
};

const fileDetails: FileDetails = {
  mediaType: 'unknown'
};

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <FileViewer fileDetails={fileDetails}/>
      </div>
    );
  }
}