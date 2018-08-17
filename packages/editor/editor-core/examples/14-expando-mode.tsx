import * as React from 'react';
import Button from '@atlaskit/button';
import Editor, { EditorAppearance } from './../src/editor';
import { IntlProvider } from 'react-intl';

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
        <IntlProvider locale="en">
          <Editor
            appearance={this.state.appearance}
            shouldFocus={true}
            quickInsert={true}
          />
        </IntlProvider>
        <Button appearance="primary" onClick={this.toggleAppearance}>
          Toggle
        </Button>
      </div>
    );
  }
}
