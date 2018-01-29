import { Avatar } from '../src/avatar-list';
import { fileToDataURI } from '../src/util';
import * as React from 'react';
import { PureComponent } from 'react';

function generateAvatarIds(start: number, count: number): Array<number> {
  const result: Array<number> = [];
  for (let i = 0; i < count; ++i) {
    result[i] = start + i;
  }
  return result;
}

export function generateAvatars(count: number): Array<Avatar> {
  return generateAvatarIds(18831, count).map(id => ({
    dataURI: `https://jdog.jira-dev.com/secure/viewavatar?avatarId=${id}&avatarType=project`,
  }));
}
