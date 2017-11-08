// tslint:disable:no-console

import * as React from 'react';
import * as mediaTestHelpers from '@atlaskit/media-test-helpers';
import Editor from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

type Props = { handleChange: any };
type State = { expanded: boolean };

class Demo extends React.Component<Props, State> {
  state = { expanded: false };

  render() {
    return (
      <div>
        <Editor
          expanded={this.state.expanded}
          isExpandedByDefault={false}
          onCancel={CANCEL_ACTION}
          onSave={SAVE_ACTION}
          onChange={this.props.handleChange}
          analyticsHandler={console.log.bind(console, 'Analytics event')}
        />

        <fieldset style={{ marginTop: 20 }}>
          <button onClick={this.toggleExpanded}>Toggle expanded state</button>
        </fieldset>
      </div>
    );
  }

  private toggleExpanded = () => this.setState({ expanded: !this.state.expanded });
}

export default function Component() {
  return <ExampleWrapper render={handleChange => <Demo handleChange={handleChange} />} />;
}
