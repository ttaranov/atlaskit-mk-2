// @flow
import type { User } from './User';

export type Comment = {
  commentId: string,
  conversationId: string,
  parentId?: string,
  document: {
    adf?: any, // ADF
    md?: string,
    html?: string,
  },
  createdBy: User | any,
  createdAt: number,
  deleted?: boolean,
  state?: 'SUCCESS' | 'SAVING' | 'ERROR',
  localId?: string,
  oldDocument?: {
    // Old document - used for restoring state
    adf?: any, // ADF
    md?: string,
    html?: string,
  },
  isPlaceholder?: boolean, // Whether this has been generated as a placeholder comment
  commentAri?: string,
  comments?: Comment[],
  error?: Error,
};
