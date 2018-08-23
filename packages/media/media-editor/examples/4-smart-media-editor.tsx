import * as React from 'react';
import Button from '@atlaskit/button';
import { SmartMediaEditor } from '../src';
import {
  createStorybookContext,
  imageFileId,
} from '@atlaskit/media-test-helpers';

interface State {
  showEditor: boolean;
}

const context = createStorybookContext();

class SmartMediaEditorExample extends React.Component<{}, State> {
  state: State = {
    showEditor: false,
  };

  openSmartEditor = () => {
    this.setState({ showEditor: true });
  };

  render() {
    const { showEditor } = this.state;

    const editor = (
      <SmartMediaEditor
        id={imageFileId}
        context={context}
        onFinish={() => console.log('finished')}
      />
    );

    return (
      <div>
        <Button onClick={this.openSmartEditor}>Open Smart Editor</Button>
        {showEditor ? editor : null}
      </div>
    );
  }
}

export default () => <SmartMediaEditorExample />;
