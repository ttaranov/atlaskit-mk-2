// @flow

import React, { Component } from 'react';

import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';

import { GoToItem } from '../';
import { Item as PresentationalItem } from '../../presentational';
import type { ConnectedItemProps } from './types';

export const iconMap = {
  ArrowRightIcon,
  BacklogIcon,
  BoardIcon,
  DashboardIcon,
  GraphLineIcon,
  FolderIcon,
  IssuesIcon,
  ShipIcon,
};

// Extract-react-types looks for the first react class in the file which won't work with SFCs
// eslint-disable-next-line no-unused-vars
class FakeClassForDocs extends Component<ConnectedItemProps> {}

const ConnectedItem = ({
  before: beforeProp,
  icon,
  ...rest
}: ConnectedItemProps) => {
  let before = beforeProp;
  // $FlowFixMe
  if (!before && icon && iconMap[icon]) {
    before = iconMap[icon];
  }

  const props = { ...rest, before };
  return props.goTo ? (
    <GoToItem {...props} />
  ) : (
    <PresentationalItem {...props} />
  );
};

export default ConnectedItem;
