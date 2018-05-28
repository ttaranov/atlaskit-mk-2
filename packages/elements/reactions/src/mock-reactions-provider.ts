import { EmojiId } from '@atlaskit/emoji';

import {
  equalEmojiId,
  findIndex,
  updateReadonlyArray,
} from './internal/helpers';
import {
  default as AbstractReactionsProvider,
  ObjectReactionKey,
  ReactionsState,
  ReactionStatus,
} from './reactions-resource';
import { Reactions, ReactionSummary } from './reactions-resource';
import { defaultReactionsByShortName } from './internal/selector';

export default class MockReactionsProvider extends AbstractReactionsProvider {
  constructor() {
    super();
    this.cachedReactions = {
      [this.objectReactionKey(
        'ari:cloud:owner:demo-cloud-id:container/1',
        'ari:cloud:owner:demo-cloud-id:item/1',
      )]: {
        status: ReactionStatus.ready,
        reactions: [
          {
            ari: 'ari:cloud:owner:demo-cloud-id:item/1',
            containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
            emojiId: (defaultReactionsByShortName.get(':fire:') as EmojiId).id!,
            count: 1,
            reacted: true,
          },
          {
            ari: 'ari:cloud:owner:demo-cloud-id:item/1',
            containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
            emojiId: (defaultReactionsByShortName.get(':thumbsup:') as EmojiId)
              .id!,
            count: 9,
            reacted: false,
          },
          {
            ari: 'ari:cloud:owner:demo-cloud-id:item/1',
            containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
            emojiId: (defaultReactionsByShortName.get(
              ':thumbsdown:',
            ) as EmojiId).id!,
            count: 5,
            reacted: false,
          },
          {
            ari: 'ari:cloud:owner:demo-cloud-id:item/1',
            containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
            emojiId: (defaultReactionsByShortName.get(
              ':heart_eyes:',
            ) as EmojiId).id!,
            count: 100,
            reacted: false,
          },
        ],
      },
    };
  }

  getReactions(keys: ObjectReactionKey[]): Promise<Reactions> {
    return new Promise<Reactions>((resolve, reject) => {
      keys.forEach(key => {
        if (
          !this.cachedReactions[
            this.objectReactionKey(key.containerAri, key.ari)
          ]
        ) {
          this.cachedReactions = {
            ...this.cachedReactions,
            [this.objectReactionKey(key.containerAri, key.ari)]: {
              status: ReactionStatus.ready,
              reactions: [],
            },
          };
        }
      });

      const results: Reactions = {};
      Object.keys(this.cachedReactions).forEach(cacheKey => {
        const objectReactions = this.cachedReactions[cacheKey];
        if (objectReactions.status === ReactionStatus.ready) {
          const ari = cacheKey.split('|')[1];
          results[ari] = objectReactions.reactions as ReactionSummary[];
        }
      });

      resolve(results);
    });
  }

  getDetailedReaction(reaction: ReactionSummary): Promise<ReactionSummary> {
    return new Promise<ReactionSummary>((resolve, reject) => {
      const users = [
        {
          id: 'oscar',
          displayName: 'Oscar Wallhult',
        },
        {
          id: 'julien',
          displayName: 'Julien Michel Hoarau',
        },
        {
          id: 'craig',
          displayName: 'Craig Petchell',
        },
        {
          id: 'jerome',
          displayName: 'Jerome Touffe-Blin',
        },
        {
          id: 'esoares',
          displayName: 'Eduardo Soares',
        },
        {
          id: 'lpereira',
          displayName: 'Luiz Pereira',
        },
        {
          id: 'pcurren',
          displayName: 'Paul Curren',
        },
        {
          id: 'ttjandra',
          displayName: 'Tara Tjandra',
        },
        {
          id: 'severington',
          displayName: 'Ste Everington',
        },
        {
          id: 'sguillope',
          displayName: 'Sylvain Guillope',
        },
        {
          id: 'alunnon',
          displayName: 'Alex Lunnon',
        },
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
        if (!this.cachedReactions[ari]) {
          this.cachedReactions = {
            ...this.cachedReactions,
            [ari]: {
              status: ReactionStatus.ready,
              reactions: [],
            },
          };
        }

        const key = this.objectReactionKey(containerAri, ari);
        const reactionsState = this.cachedReactions[key];
        if (reactionsState.status === ReactionStatus.ready) {
          const reactionIndex = findIndex(
            reactionsState.reactions,
            r => r.emojiId === emojiId,
          );

          setTimeout(() => {
            if (reactionIndex !== -1) {
              reactionsState.reactions = updateReadonlyArray(
                reactionsState.reactions,
                reactionIndex,
                _ => reactionDetails,
              );
            } else {
              reactionsState.reactions = reactionsState.reactions.concat(
                reactionDetails,
              );
            }
            this.notifyUpdated(containerAri, ari, this.cachedReactions[key]);
            resolve(reactionDetails);
          }, 1);
        }
      });
    });
  }

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    return new Promise<ReactionsState>((resolve, reject) => {
      const key = this.objectReactionKey(containerAri, ari);
      const reactionsState = this.cachedReactions[key];
      if (reactionsState.status === ReactionStatus.ready) {
        const index = findIndex(reactionsState.reactions, reaction =>
          equalEmojiId(reaction.emojiId, emojiId),
        );

        if (index !== -1) {
          const reaction = reactionsState.reactions[index];
          reaction.reacted = true;
          reaction.count++;
        } else {
          reactionsState.reactions = reactionsState.reactions.concat({
            ari: ari,
            containerAri: containerAri,
            emojiId: emojiId,
            count: 1,
            reacted: true,
          });
        }
      }

      resolve(this.cachedReactions[key]);
    });
  }

  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState> {
    return new Promise<ReactionsState>((resolve, reject) => {
      const key = this.objectReactionKey(containerAri, ari);
      const reactionsState = this.cachedReactions[key];
      if (reactionsState.status === ReactionStatus.ready) {
        const index = findIndex(reactionsState.reactions, reaction =>
          equalEmojiId(reaction.emojiId, emojiId),
        );
        const reaction = reactionsState.reactions[index];

        reaction.reacted = false;
        reaction.count--;

        if (reaction.count < 1) {
          reactionsState.reactions = reactionsState.reactions.filter(
            (value, i) => index !== i,
          );
        }
      }

      resolve(this.cachedReactions[key]);
    });
  }
}

export const reactionsProvider = new MockReactionsProvider();
export const reactionsProviderPromise = Promise.resolve(reactionsProvider);
