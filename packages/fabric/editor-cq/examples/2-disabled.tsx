// tslint:disable:no-console

import * as React from 'react';
import * as mediaTestHelpers from '@atlaskit/media-test-helpers';
import Editor from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { resourceProvider } from '../example-helpers/mentions/story-data';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionProvider = new Promise<any>(resolve => {
  resolve(resourceProvider);
});

type Props = { handleChange: any };
type State = { disabled: boolean };

class Demo extends React.Component<Props, State> {
  state = { disabled: true };

  render() {
    console.log(this.props.handleChange);
    return (
      <div>
        <Editor
          disabled={this.state.disabled}
          isExpandedByDefault={true}
          onCancel={CANCEL_ACTION}
          onSave={SAVE_ACTION}
          onChange={this.props.handleChange}
          mentionProvider={mentionProvider}
          analyticsHandler={console.log.bind(console, 'Analytics event')}
        />

        <fieldset style={{ marginTop: 20 }}>
          <button onClick={this.toggleDisabled}>Toggle disabled state</button>
        </fieldset>
      </div>
    );
  }

  private toggleDisabled = () => this.setState({ disabled: !this.state.disabled });
}

export default function Component() {
  return <ExampleWrapper render={handleChange => <Demo handleChange={handleChange} />} />;
}
