// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

type Props = { handleChange: any };
type State = { isDisabled: boolean };

class Demo extends React.Component<Props, State> {
  state = { isDisabled: true };

  render() {
    return (
      <div>
        <Editor
          isDisabled={this.state.isDisabled}
          isExpandedByDefault={true}
          onCancel={CANCEL_ACTION}
          onSave={SAVE_ACTION}
          onChange={this.props.handleChange}
        />

        <fieldset style={{ marginTop: 20 }}>
          <button onClick={this.toggleDisabled}>Toggle disabled state</button>
        </fieldset>
      </div>
    );
  }

  private toggleDisabled = () =>
    this.setState({ isDisabled: !this.state.isDisabled });
}

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => <Demo handleChange={handleChange} />}
    />
  );
}
