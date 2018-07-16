export type ReactionsState =
  | ReactionsReadyState
  | ReactionsLoading
  | ReactionsError;

export enum ReactionStatus {
  ready = 'READY',
  loading = 'LOADING',
  error = 'ERROR',
}

export interface ReactionsReadyState {
  readonly status: ReactionStatus.ready;
  readonly reactions: ReactionSummary[];
}

export type ReactionsLoading = {
  readonly status: ReactionStatus.loading;
};

export type ReactionsError = {
  readonly status: ReactionStatus.error;
  readonly message: string;
};

export interface ReactionSummary {
  ari: string;
  containerAri: string;
  emojiId: string;
  count: number;
  reacted: boolean;
  users?: User[];
  optimisticallyUpdated?: boolean;
}

export interface User {
  id: string;
  displayName: string;
}

export interface DetailedReaction {
  ari: string;
  emojiId: string;
  count: number;
  users: User[];
}

export interface User {
  id: string;
  displayName: string;
}

export interface Listener {
  handler: SubscriptionHandler;
}

export interface Reactions {
  [key: string]: ReactionSummary[];
}

export interface ObjectReactionKey {
  containerAri: string;
  ari: string;
}

export type SubscriptionHandler = (state: ReactionsState) => void;

export interface ReactionsProvider {
  getReactions(keys: ObjectReactionKey[]): Promise<Reactions>;
  getDetailedReaction(reaction: ReactionSummary): Promise<ReactionSummary>;
  toggleReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    /**
     * Epoch time of when the object being reacted on was created
     */
    objectCreationTimestamp?: number,
  ): Promise<ReactionsState>;

  addReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
    /**
     * Epoch time of when the object being reacted on was created
     */
    objectCreationTimestamp?: number,
  ): Promise<ReactionsState>;
  deleteReaction(
    containerAri: string,
    ari: string,
    emojiId: string,
  ): Promise<ReactionsState>;
  fetchReactionDetails(reaction: ReactionSummary): Promise<ReactionSummary>;
  notifyUpdated(containerAri: string, ari: string, state: ReactionsState): void;
  subscribe(
    objectReactionKey: ObjectReactionKey,
    handler: SubscriptionHandler,
  ): void;
  unsubscribe(
    objectReactionKey: ObjectReactionKey,
    handler: SubscriptionHandler,
  ): void;
}
