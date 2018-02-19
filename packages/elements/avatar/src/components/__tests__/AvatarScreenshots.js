// @flow
import * as path from 'path';
import React from 'react';
import { openNewPage } from 'jest-puppe-shots';

import Avatar from '../Avatar';

describe('Avatar', () => {
  let page;
  beforeEach(async () => {
    page = await openNewPage();
  });

  it('should render large avatar', async () => {
    const component = await page.mount(
      <Avatar name="large" size="large" presence="offline" />,
    );
    const screenshot = await page.takeScreenshot();

    return expect(screenshot).toMatchImageSnapshot();
  });
});
