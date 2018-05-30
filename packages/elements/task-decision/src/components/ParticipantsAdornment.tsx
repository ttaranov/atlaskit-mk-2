import * as React from 'react';
import { ParticipantsWrapper } from '../styled/ParticipantsAdornment';
import { User, Appearance } from '../types';
import Participants from './Participants';

type Props = {
  participants?: User[];
  appearance?: Appearance;
};

export const ParticipantsAdornment = ({ participants, appearance }: Props) => {
  if (appearance === 'card' && participants) {
    return (
      <ParticipantsWrapper>
        <Participants participants={participants} />
      </ParticipantsWrapper>
    );
  }

  return null;
};
