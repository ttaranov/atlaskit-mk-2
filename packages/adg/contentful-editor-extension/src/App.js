import React, { Component } from 'react';
import { EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import Example from './components/ExampleEditor';
import data from './DESIGN_SITE_DATA';

console.log(data);

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
