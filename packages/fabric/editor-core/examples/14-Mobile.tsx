import * as React from 'react';
import Editor from './../src/editor';
import EditorContext from '../src/editor/ui/EditorContext';
import WithEditorActions from '../src/editor/ui/WithEditorActions';
import { MentionDescription, MentionProvider } from '../../mention/dist/es5';

class MentionProviderImpl implements MentionProvider {
  filter(query?: string): void {}
  recordMentionSelection(mention: MentionDescription): void {}
  shouldHighlightMention(mention: MentionDescription): boolean {
    return false;
  }
  isFiltering(query: string): boolean {
    return false;
  }
  subscribe(
    key: string,
    callback?,
    errCallback?,
    infoCallback?,
    allResultsCallback?,
  ): void {}
  unsubscribe(key: string): void {}
}

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
