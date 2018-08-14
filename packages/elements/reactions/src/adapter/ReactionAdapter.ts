import { Reactions } from '../types/Reactions';
import { ReactionSummary } from '../types/ReactionSummary';

export type EmojiRequest<T> = (
  containerAri: string,
  ari: string,
  emojiId: string,
) => Promise<T>;

export interface ReactionAdapter {
  getReactions(containerAri: string, aris: string[]): Promise<Reactions>;
  getDetailedReaction: EmojiRequest<ReactionSummary>;
  addReaction: EmojiRequest<ReactionSummary[]>;
  deleteReaction: EmojiRequest<ReactionSummary[]>;
}
