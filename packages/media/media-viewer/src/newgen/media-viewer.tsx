import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Positioner, ErrorMessage } from './styled';

export type Props = {
  onClose?: () => void;
};

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    const { onClose } = this.props;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <Positioner>
          <ErrorMessage>The current file type is unsupported.</ErrorMessage>
        </Positioner>
      </div>
    );
  }
}
