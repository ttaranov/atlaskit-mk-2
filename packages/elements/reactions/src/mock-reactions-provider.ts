import { EmojiId } from '@atlaskit/emoji';

import {
  default as AbstractReactionsProvider,
  ObjectReactionKey,
  ReactionsState,
  Reactions,
  ReactionSummary,
} from './reactions-resource';
import { defaultReactionsByShortName } from './internal/selector';

const user = (id: string, displayName: string) => ({ id, displayName });

const containerAri: string = 'ari:cloud:owner:demo-cloud-id:container/1';
const ari: string = 'ari:cloud:owner:demo-cloud-id:item/1';
const reaction = (shortName: string, count: number, reacted: boolean) => ({
  ari,
  containerAri,
  emojiId: (defaultReactionsByShortName.get(shortName) as EmojiId).id!,
  count,
  reacted,
});

export default class MockReactionsProvider extends AbstractReactionsProvider {
  public mockData: {
    readonly [key: string]: ReactionSummary[];
  };

  constructor() {
    super();

    this.mockData = {
      [this.objectReactionKey(containerAri, ari)]: [
        reaction(':fire:', 1, true),
        reaction(':thumbsup:', 9, false),
        reaction(':thumbsdown:', 5, false),
        reaction(':heart_eyes:', 100, false),
      ],
    };
  }

  getReactions(keys: ObjectReactionKey[]): Promise<Reactions> {
    return new Promise<Reactions>((resolve, reject) => {
      resolve(
        keys.reduce((results, key) => {
          const reactionKey = this.objectReactionKey(key.containerAri, key.ari);
          results[key.ari] = this.mockData[reactionKey] || [];
          return results;
        }, {}),
      );
    });
  }

  getDetailedReaction(reaction: ReactionSummary): Promise<ReactionSummary> {
    return new Promise<ReactionSummary>((resolve, reject) => {
      const users = [
        user('oscar', 'Oscar Wallhult'),
        user('julien', 'Julien Michel Hoarau'),
        user('craig', 'Craig Petchell'),
        user('jerome', 'Jerome Touffe-Blin'),
        user('esoares', 'Eduardo Soares'),
        user('lpereira', 'Luiz Pereira'),
        user('pcurren', 'Paul Curren'),
        user('ttjandra', 'Tara Tjandra'),
        user('severington', 'Ste Everington'),
        user('sguillope', 'Sylvain Guillope'),
        user('alunnon', 'Alex Lunnon'),
      ].slice(Math.floor(Math.random() * 4), Math.floor(Math.random() * 9) + 4);

      resolve({
        ...reaction,
        users,
      });
    });
  }

  fetchReactionDetails(reaction: ReactionSummary): Promise<ReactionSummary> {
    const { containerAri, ari, emojiId } = reaction;
    return new Promise<ReactionSummary>((resolve, reject) => {
      this.getDetailedReaction(reaction).then(reactionDetails => {
        this.updateEmojiState(containerAri, ari, emojiId, reactionDetails);
        resolve(reactionDetails);
      });
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    return new Promise<ReactionsState>((resolve, reject) => {
      resolve(
        this.updateEmojiState(containerAri, ari, emojiId, reaction => {
          return {
            ...reaction,
            count: reaction.count + 1,
            reacted: true,
          };
        }),
      );
    });
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    return new Promise<ReactionsState>((resolve, reject) => {
      resolve(
        this.updateEmojiState(containerAri, ari, emojiId, reaction => {
          return {
            ...reaction,
            count: reaction.count - 1,
            reacted: false,
          };
        }),
      );
    });
  }
}

export const reactionsProvider = new MockReactionsProvider();
export const reactionsProviderPromise = Promise.resolve(reactionsProvider);
