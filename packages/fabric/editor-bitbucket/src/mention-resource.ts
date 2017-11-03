import { AbstractMentionResource, MentionsResult } from '@atlaskit/editor-core';

export interface MentionSource {
  query(query: string): void;
  on(eventName: string, handler: (response: { query: string, results: Array<{ attributes: { username: string, display_name: string, avatar_url: string, is_teammate?: boolean } }> }) => void);
}

class MentionResource extends AbstractMentionResource {
  private mentionSource: MentionSource;

  constructor(mentionSource: MentionSource) {
    super();
    this.mentionSource = mentionSource;
  }

  filter(query: string) {
    const notify = (mentionsResult: MentionsResult) => {
      this._notifyListeners(mentionsResult);
      this._notifyAllResultsListeners(mentionsResult);
    };

    const notifyInfo = (info: string) => {
      this._notifyInfoListeners(info);
    };

    const notifyErrors = (error: any) => {
      this._notifyErrorListeners(error);
    };

    if (this.mentionSource) {
      this.mentionSource.on('respond', (response) => {
        if (response.query !== query) {
          return;
        }

        if (!response.results.length) {
          if (query.length >= 3) {
            notifyInfo(`Found no matches for ${query}`); // TODO: i18n
          } else {
            notifyInfo('Continue typing to search for a user'); // TODO: 18n
          }
          notify({mentions: [], query});
        } else {
          const allMentions = response.results.map((item, index) => {
            return {
              id: item.attributes.username,
              avatarUrl: item.attributes.avatar_url,
              name: item.attributes.display_name,
              mentionName: item.attributes.username,
              lozenge: item.attributes.is_teammate ? 'teammate' : ''
            };
          }).sort((itemA, itemB) => itemA.name < itemB.name ? 0 : 1 ); // Sort by name

          // Display teammates first
          const mentions = [
            ...allMentions.filter(item => !!item.lozenge),
            ...allMentions.filter(item => !item.lozenge)
          ];

          notify({ mentions, query });
        }
      });

      if (query.length < 3) {
        notifyInfo('Continue typing to search for a user'); // TODO: i18n
      }

      this.mentionSource.query(query);
    } else {
      notifyErrors(new Error('No mentions source provided'));
    }
  }
}

export { MentionResource };
