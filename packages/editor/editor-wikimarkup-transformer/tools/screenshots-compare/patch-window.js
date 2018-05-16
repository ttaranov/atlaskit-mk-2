const { DOMWindow, JSDOM } = require('jsdom');
const createDOM = () => new JSDOM('<!DOCTYPE html></html>').window;
const w = createDOM();

global.document = w.document;
global.navigator = w.navigator;
global.self = w;
global.window = w;
global.HTMLElement = w.HTMLElement;

// @see https://github.com/tmpvar/jsdom/issues/1539
global.document.execCommand = () => ({});

// patch native require to support webpack's require.ensure
Object.defineProperties(Object.getPrototypeOf(require), {
  ensure: {
    value: () => ({}),
  },
});
