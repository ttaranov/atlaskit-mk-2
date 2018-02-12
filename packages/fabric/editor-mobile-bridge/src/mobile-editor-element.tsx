import * as React from 'react';
import Editor from '@atlaskit/editor-core/editor';
import { MentionProvider, MentionDescription } from '../../mention/src';
import {
  ErrorCallback,
  InfoCallback,
  ResultCallback,
} from '../../mention/src/api/MentionResource';

/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
 * TODO consider to move this helper class to somewhere outside example
 */
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
    callback?: ResultCallback<MentionDescription[]>,
    errCallback?: ErrorCallback,
    infoCallback?: InfoCallback,
    allResultsCallback?: ResultCallback<MentionDescription[]>,
  ): void {}
  unsubscribe(key: string): void {}
}

export default function mobileEditor() {
  return (
    <Editor
      appearance="mobile"
      allowHyperlinks={true}
      allowTextFormatting={true}
      allowMentions={true}
      mentionProvider={Promise.resolve(new MentionProviderImpl())}
    />
  );
}
