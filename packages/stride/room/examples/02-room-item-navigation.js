// @flow
import React from 'react';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';
import Tooltip from '@atlaskit/tooltip';
import { atlaskit, basketBall } from './utils';
import RoomItem from '../src';

export default () => (
  <div>
    <RoomItem
      image={atlaskit}
      description="Atlaskit"
      size="xsmall"
      actions={
        <Tooltip content="Close Room" position="bottom">
          <CloseIcon size="small" label="Close Room" />
        </Tooltip>
      }
    />
    <RoomItem
      image={basketBall}
      description="Basketball-Syd"
      size="xsmall"
      actions={
        <Tooltip content="New messages" position="bottom">
          <PresenceActiveIcon size="small" label="Close Room" />
        </Tooltip>
      }
    />
  </div>
);
