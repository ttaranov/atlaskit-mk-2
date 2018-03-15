import * as React from 'react';
import { MediaViewer } from '../src/newgen/media-viewer';
import Button from '@atlaskit/button';

type State = {
  isOpen: boolean;
};

export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: false };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isOpen: true })}>
          Preview an unsupported item
        </Button>
        {this.state.isOpen && (
          <MediaViewer onClose={() => this.setState({ isOpen: false })} />
        )}
      </div>
    );
  }
}
