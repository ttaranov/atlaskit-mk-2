import * as React from 'react';
import Button from '@atlaskit/button';
import Editor, { EditorAppearance } from './../src/editor';

export type ExampleState = { appearance: EditorAppearance };

export default class Example extends React.Component<{}, ExampleState> {
  state = { appearance: 'message' } as ExampleState;

  toggleAppearance = () => {
    this.setState(
      prevState =>
        prevState.appearance === 'message'
          ? { appearance: 'comment' }
          : { appearance: 'message' },
    );
  };

  render() {
    return (
      <div>
        <Editor
          appearance={this.state.appearance}
          shouldFocus={true}
          quickInsert={true}
        />
        <Button appearance="primary" onClick={this.toggleAppearance}>
          Toggle
        </Button>
      </div>
    );
  }
}
