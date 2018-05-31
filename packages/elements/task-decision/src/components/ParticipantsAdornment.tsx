import * as React from 'react';
import { User, Appearance } from '../types';
import Participants from './Participants';

type Props = {
  participants?: User[];
  appearance?: Appearance;
};

export const ParticipantsAdornment = ({ participants, appearance }: Props) => {
  if (appearance === 'card' && participants) {
    return <Participants participants={participants} />;
  }

  return null;
};
