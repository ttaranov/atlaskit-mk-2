import React, { Component } from 'react';
import { EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import Example from './components/ExampleEditor';

class App extends Component {
  render() {
    return (
      <EditorContext>
        <WithEditorActions render={actions => <Example actions={actions} />} />
      </EditorContext>
    );
  }
}

export default App;
