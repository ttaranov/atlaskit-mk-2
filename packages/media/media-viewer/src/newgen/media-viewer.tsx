import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { FileViewer, FileDetails } from './file-viewer';

export type Props = {
  onClose?: () => void;
};

const fileDetails: FileDetails = {
  mediaType: 'unknown',
};

export class MediaViewer extends React.Component<Props, {}> {
  // componentDidMount... // fetches the state - would this be testable?
  // context mocks?
  // we could encapsulate all the provider logic into a different model
  //

  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <FileViewer fileDetails={fileDetails} />
      </div>
    );
  }
}
