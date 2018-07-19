/**
@jest-environment node
*/
// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
// import Portal from '../..';

test(`Portal renders nothing when server side rendered`, () => {
  expect(() =>
    ReactDOMServer.renderToString(<div>Hi there</div>),
  ).not.toThrowError();
});
