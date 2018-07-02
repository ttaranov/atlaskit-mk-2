/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('should be possible to create a server side friendly component', () => {
    expect(() => ReactDOMServer.renderToString(<Avatar />)).not.toThrowError();
  });
});
