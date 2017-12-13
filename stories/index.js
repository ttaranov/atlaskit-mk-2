import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Button, Welcome } from '@storybook/react/demo';
import { injectGlobal } from 'styled-components';
import ConfluencePageTree from '../packages/fabric/confluence-page-tree';

// eslint-disable-next-line
injectGlobal`
  body {
    background-color: #FFF;
    color: #172B4D;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.42857142857143;
    letter-spacing: -0.005em;
    margin: 0;
  }
`;

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('ConfluencePageTree', module).add('default', () => (
  <ConfluencePageTree
    contentId={'65538'}
    cloudId={'56765c63-6627-4235-9328-e3a28ef97069'}
  />
));
