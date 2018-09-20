import * as React from 'react';
import { ReactionAction } from '../types/Actions';
import { State } from './ReactionContext';

export type Actions = {
  getReactions: (containerId: string, aris: string) => void;
  toggleReaction: ReactionAction;
  addReaction: ReactionAction;
  getDetailedReaction: ReactionAction;
};

type ContextType =
  | {
      value: State;
      actions: Actions;
    }
  | undefined;

export const ReactionsContext = React.createContext<ContextType>(undefined);
