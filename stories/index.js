import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Button, Welcome } from '@storybook/react/demo';
import '@atlaskit/css-reset';
import ConfluencePageTree from '../packages/fabric/confluence-page-tree';

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

storiesOf('ConfluencePageTree', module)
  .add('default', () => (
    <ConfluencePageTree
      contentId={'65538'}
      cloudId={'56765c63-6627-4235-9328-e3a28ef97069'}
    />
  ))
  .add('error', () => (
    <ConfluencePageTree
      contentId={'655381'}
      cloudId={'56765c63-6627-4235-9328-e3a28ef97069'}
    />
  ));
