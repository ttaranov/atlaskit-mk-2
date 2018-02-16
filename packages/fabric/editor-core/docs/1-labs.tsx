import { md, code } from '@atlaskit/docs';

export default md`
  # Editor Labs

  Where API changes can sit for experimental use

  ## EditorWithActions

  Based off feedback from our consumers, the existing approach of passing the EditorView as the argument to the onSave / onCancel / onChange callback functions unnecessarily leaks the abstraction over Prosemirror that the editor is supposed to provider.

  This change introduces a breaking API change that passes the EditorActions object as the argument instead.

${code`
  import { EditorWithActions } from '@atlaskit/editor-core';

  handleSave = actions => {
    actions.getValue().then(value => console.log(value));
  };

  render(<Editor onSave={this.handleSave} />);
`}
  This replaces code that looked like:

${code`
  import {
    Editor,
    WithEditorActions,
    EditorContext,
  } from '@atlaskit/editor-core';

  handleSave = actions => () => {
    actions.getValue().then(value => console.log(value));
  };

  render(
    <EditorContext>
      <WithEditorActions
        render={actions => <Editor onSave={this.handleSave(actions)} />}
      />
    </EditorContext>,
  );
`}

  or

${code`
  import { Editor, WithEditorActions, EditorContext } from '@atlaskit/editor-core';

  class ExtendedEditor extends React.Component {
    handleSave = () => {
      this.props.actions.getValue().then(value => console.log(value));
    }

    render() {
      const { actions, ...props } = this.props;
      return <Editor {...props} onSave={this.handleSave} />;
    }
  }

  render(
    <EditorContext>
      <WithEditorActions
        render={actions => <ExtendedEditor {...props} actions={actions} />
      />
    </EditorContext>
  )
`}
`;
