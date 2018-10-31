/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
 */
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

export default Promise.resolve(new MentionProviderImpl());
