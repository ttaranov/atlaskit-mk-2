// @flow

import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import Flag, { FlagGroup } from '../src';

type State = {
  flags: Array<?flagData>,
};

type flagData = {
  created: number,
  description: string,
  icon: Node,
  id: number,
  key: number,
  title: string,
};

const getRandomIcon = () => {
  const icons = iconMap();
  const iconArray = Object.keys(icons).map(i => icons[i]);
  return iconArray[Math.floor(Math.random() * iconArray.length)];
};

const iconMap = (key, color) => {
  const icons = {
    info: <Info label="Info icon" primaryColor={color || colors.P300} />,
    success: <Tick label="Success icon" primaryColor={color || colors.G300} />,
    warning: (
      <Warning label="Warning icon" primaryColor={color || colors.Y300} />
    ),
    error: <Error label="Error icon" primaryColor={color || colors.R300} />,
  };

  return key ? icons[key] : icons;
};

const getRandomDescription = () => {
  const descriptions = [
    'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
    'Fruitcake topping wafer pie candy dragée sesame snaps cake. Cake cake cheesecake. Pie tiramisu carrot cake tart tart dessert cookie. Lemon drops cookie tootsie roll marzipan liquorice cotton candy brownie halvah.',
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getFlagData = (index: number, timeOffset: number = 0): flagData => {
  return {
    created: Date.now() - timeOffset * 1000,
    description: getRandomDescription(),
    icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`,
  };
};

export default class FlagGroupExample extends Component<void, State> {
  state = { flags: [] };
  flagCount = 0;

  addFlag = () => {
    const flags = this.state.flags.slice();
    flags.unshift(getFlagData(this.flagCount++));
    this.setState({ flags });
  };

  dismissFlag = () => {
    this.setState(state => ({ flags: state.flags.slice(1) }));
    this.flagCount--;
  };

  render() {
    const actions = [
      {
        content: 'Nice one!',
        onClick: () => {},
      },
      { content: 'Not right now thanks', onClick: this.dismissFlag },
    ];

    return (
      <div>
        <FlagGroup onDismissed={this.dismissFlag}>
          {this.state.flags.map(flag => <Flag actions={actions} {...flag} />)}
        </FlagGroup>
        <Button onClick={this.addFlag}>Add Flag</Button>
      </div>
    );
  }
}
