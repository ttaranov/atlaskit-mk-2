// @flow
import React from 'react';
import { openNewPage } from 'jest-puppe-shots';

import Button, { ButtonBase } from '../src/components/Button';

describe('Button', () => {
  let page;
  beforeEach(async () => {
    page = await openNewPage();
  });

  it('should render primary button', async () => {
    const component = await page.mount(
      <Button appearance="danger">Primary Button</Button>,
    );
    const screenshot = await page.takeScreenshot();

    return expect(screenshot).toMatchImageSnapshot();
  });
});
