import { ReactionStatus } from './ReactionStatus';
import { ReactionSummary } from './ReactionSummary';

export type ReactionsState =
  | ReactionsReadyState
  | ReactionsLoading
  | ReactionsError;

export type ReactionsReadyState = {
  readonly status: ReactionStatus.ready;
  readonly reactions: ReactionSummary[];
};

export type ReactionsLoading = {
  readonly status: ReactionStatus.loading;
};

export type ReactionsError = {
  readonly status: ReactionStatus.error;
  readonly message: string;
};
