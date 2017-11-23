/* @flow */

import React, { type Node } from 'react';
import {
  AkCustomDrawer,
  AkNavigationItem,
  AkNavigationItemGroup,
} from '@atlaskit/navigation';

import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Groups from './Groups';

import * as fs from '../../utils/fs';
import type { Directory } from '../../types';

const GroupDrawer = ({
  children,
  closeDrawer,
  isOpen,
}: {
  children: Node,
  closeDrawer: () => mixed,
  isOpen: boolean,
}) => (
  <AkCustomDrawer
    backIcon={<ArrowLeftIcon label="go back" />}
    isOpen={isOpen}
    key="groups"
    onBackButton={closeDrawer}
    primaryIcon={<AtlassianIcon label="Atlaskit" />}
  >
    {children}
  </AkCustomDrawer>
);

export default GroupDrawer;
