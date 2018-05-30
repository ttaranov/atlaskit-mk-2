// @flow
import React from 'react';
import { atlaskit, basketBall } from './utils';
import RoomItem from '../src';

export default () => (
  <div>
    <RoomItem
      image={atlaskit}
      roomName="Atlaskit"
      description="Website:  go/ak | Issues? Atlaskit requests room to talk about the tickets you raised at http://go/ak-bug"
      size="small"
    />
    <RoomItem
      image={basketBall}
      roomName="Javascript"
      description="var x = []; console.log(x == !x); console.log( {} - [] );m"
      size="small"
    />
  </div>
);
