import { EmojiResource } from '../../src/api/EmojiResource';

/**
 * #initSiteEmojiResource throws error
 */
export class ErrorEmojiResource extends EmojiResource {
  getActiveLoaders() {
    return this.activeLoaders;
  }

  initSiteEmojiResource(emojiResponse, provider): Promise<void> {
    throw new Error('Cannot initSiteEmojiResource');
  }
}
