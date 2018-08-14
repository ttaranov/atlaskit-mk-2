import * as React from 'react';
import { ReactionAction } from '../types/Actions';
import { State } from './ReactionProvider';

export type Actions = {
  getReactions: (containerId: string, aris: string) => void;
  toggleReaction: ReactionAction;
  addReaction: ReactionAction;
  getDetailedReaction: ReactionAction;
};

type ContextType = {
  value: State;
  actions: Actions;
};

const noop = () => {};

export const ReactionsContext = React.createContext<ContextType>({
  value: {
    reactions: {},
    flash: {},
  },
  actions: {
    getReactions: noop,
    toggleReaction: noop,
    addReaction: noop,
    getDetailedReaction: noop,
  },
});
