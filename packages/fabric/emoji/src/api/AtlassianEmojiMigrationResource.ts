import {
  EmojiDescription,
  EmojiId,
  EmojiResponse,
  OptionalEmojiDescription,
} from '../types';
import { customType, migrationUserId } from '../constants';
import EmojiRepository from './EmojiRepository';
import EmojiResource from './EmojiResource';

const atlassian = 'atlassian';

const removeDuplicateAtlassianEmoji = (
  emojis: EmojiDescription[],
  duplicateEmojis: Set<string>,
): EmojiDescription[] => {
  if (!duplicateEmojis.size) {
    return emojis;
  }
  return emojis.filter(
    emoji =>
      !(
        duplicateEmojis.has(emoji.shortName) &&
        emoji.type.toLowerCase() === atlassian
      ),
  );
};

const isAtlassianId = (id?: string) => id && id.indexOf(`${atlassian}-`) === 0;

/**
 * EmojiResource that removes an Atlassian emoji if there is a corresponding site emoji duplicate
 * This will temporarily be exported to editor-core -> editor-hipchat -> * during the Atlassian
 * emoji migration process and used in lieu of the base EmojiResource.
 * After successful migration, this will be removed and replaced by EmojiResource.
 */
export default class AtlassianEmojiMigrationResource extends EmojiResource {
  protected initEmojiRepository(emojiResponses: EmojiResponse[]): void {
    let emojis: EmojiDescription[] = [];
    const siteEmojis: Set<string> = new Set();
    const atlassianEmojis: Set<string> = new Set();

    emojiResponses.forEach(emojiResponse => {
      if (!emojiResponse.emojis.length) {
        return;
      }

      if (emojiResponse.emojis[0].type.toUpperCase() === customType) {
        emojiResponse.emojis.forEach(emoji => siteEmojis.add(emoji.shortName));
      }
      if (emojiResponse.emojis[0].type.toLowerCase() === atlassian) {
        emojiResponse.emojis.forEach(emoji =>
          atlassianEmojis.add(emoji.shortName),
        );
      }
      emojis = emojis.concat(emojiResponse.emojis);
    });

    const duplicateEmojis: Set<string> = new Set(
      Array.from(atlassianEmojis).filter(name => siteEmojis.has(name)),
    );
    emojis = removeDuplicateAtlassianEmoji(emojis, duplicateEmojis);
    this.emojiRepository = new EmojiRepository(emojis);
  }

  findByEmojiId(
    emojiId: EmojiId,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    const { id, shortName } = emojiId;
    if (isAtlassianId(id) && this.emojiRepository) {
      const matches = this.emojiRepository.findAllMatchingShortName(shortName);
      if (matches.length) {
        const migratedEmoji = matches.filter(
          emoji => emoji.creatorUserId === migrationUserId,
        );
        if (migratedEmoji.length) {
          // Should only be single match
          return migratedEmoji[0];
        }
      }
      return undefined;
    }
    return super.findByEmojiId(emojiId);
  }
}
