// @flow
import { mount } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import {
  AtlassianIcon,
  BitbucketIcon,
  ConfluenceIcon,
  HipchatIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  StatuspageIcon,
  StrideIcon,
} from '../..';

cases(
  'Product Icons Snapshot',
  component => {
    const wrapper = mount(<component.augend />);
    expect(wrapper).toMatchSnapshot();
  },
  [
    { name: 'AtlassianIcon', augend: AtlassianIcon },
    { name: 'BitbucketIcon', augend: BitbucketIcon },
    { name: 'ConfluenceIcon', augend: ConfluenceIcon },
    { name: 'HipchatIcon', augend: HipchatIcon },
    { name: 'JiraCoreIcon', augend: JiraCoreIcon },
    { name: 'JiraIcon', augend: JiraIcon },
    { name: 'JiraServiceDeskIcon', augend: JiraServiceDeskIcon },
    { name: 'JiraSoftwareIcon', augend: JiraSoftwareIcon },
    { name: 'StatuspageIcon', augend: StatuspageIcon },
    { name: 'StrideIcon', augend: StrideIcon },
  ],
);
