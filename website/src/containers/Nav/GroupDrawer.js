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
import DefaultNav from './navigations/Default';

import * as fs from '../../utils/fs';
import type { Directory } from '../../types';
import { AtlaskitIcon } from './index';

type Props = {
  children: Node,
  closeDrawer: () => mixed,
  isOpen: boolean,
  pathname: string,
};

const GroupDrawer = ({ children, closeDrawer, isOpen, pathname }: Props) => (
  <AkCustomDrawer
    backIcon={<ArrowLeftIcon label="go back" />}
    isOpen={isOpen}
    key="groups"
    onBackButton={closeDrawer}
    primaryIcon={<AtlaskitIcon monochrome />}
  >
    <DefaultNav onClick={closeDrawer} pathname={pathname} />
  </AkCustomDrawer>
);

export default GroupDrawer;
