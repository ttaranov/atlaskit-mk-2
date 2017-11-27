// @flow

import React from 'react';
import EmptyState from '../src/EmptyState';
import exampleImage from './img/example-image.svg';

const props = {
  header: 'I am the header',
  description: `Lorem ipsum is a pseudo-Latin text used in web design, 
        typography, layout, and printing in place of English to emphasise 
        design elements over content. It's also called placeholder (or filler) 
        text. It's a convenient tool for mock-ups.`,
  imageUrl: exampleImage,
  maxImageWidth: 400,
  maxImageHeight: 400,
  primaryAction: {
    label: 'Primary action',
    onClick: () => console.log('Primary action clicked'),
  },
  linkAction: {
    label: 'Link action',
    url: 'http://www.example.com',
    onClick: () => console.log('Link action clicked'),
  },
};

export default () => <EmptyState {...props} />;
