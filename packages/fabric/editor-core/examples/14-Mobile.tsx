import * as React from 'react';
import Editor from './../src/editor';
import EditorContext from '../src/editor/ui/EditorContext';
import WithEditorActions from '../src/editor/ui/WithEditorActions';
import { MentionProviderImpl } from '../../editor-mobile-bridge/src/mobile-editor-element';

export function mobileEditor() {
  return (
    <EditorContext>
      <div>
        <WithEditorActions render={actions => <div />} />
        <Editor
          appearance="mobile"
          allowHyperlinks={true}
          allowTextFormatting={true}
          allowMentions={true}
          mentionProvider={Promise.resolve(new MentionProviderImpl())}
          onChange={editorView => this.setState({})}
        />
      </div>
    </EditorContext>
  );
}

export default function Example() {
  return (
    <div>
      <p>Editor that is used by mobile applications.</p>
      {mobileEditor()}
    </div>
  );
}
