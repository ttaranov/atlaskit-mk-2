import * as React from 'react';
import { Editor } from '../src/index';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';

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
          mentionProvider={Promise.resolve(new MentionProviderImpl())}
          quickInsert={true}
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
