// @flow

import React, { type Node } from 'react';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import {
  akColorG300,
  akColorP100,
  akColorR300,
  akColorY300,
} from '@atlaskit/util-shared-styles';

export type flagData = {
  created: number,
  description: string,
  icon: Node,
  id: number,
  key: number,
  title: string,
};

const iconMap = (key, color) => {
  const icons = {
    info: <Info label="Info icon" primaryColor={color || akColorP100} />,
    success: <Tick label="Success icon" primaryColor={color || akColorG300} />,
    warning: (
      <Warning label="Warning icon" primaryColor={color || akColorY300} />
    ),
    error: <Error label="Error icon" primaryColor={color || akColorR300} />,
  };

  return key ? icons[key] : icons;
};

export function getRandomDescription() {
  const descriptions = [
    'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
    'Fruitcake topping wafer pie candy dragée sesame snaps cake. Cake cake cheesecake. Pie tiramisu carrot cake tart tart dessert cookie. Lemon drops cookie tootsie roll marzipan liquorice cotton candy brownie halvah.',
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
export function getRandomIcon() {
  const icons = iconMap();
  const iconArray = Object.keys(icons).map(i => icons[i]);
  return iconArray[Math.floor(Math.random() * iconArray.length)];
}

export function getIcon(key: string, color: string) {
  return iconMap(key, color);
}
export function getFlagData(index: number, timeOffset: number = 0): flagData {
  return {
    created: Date.now() - timeOffset * 1000,
    description: getRandomDescription(),
    icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`,
  };
}
