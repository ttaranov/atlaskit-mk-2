// @flow
/*
  Fork of a11y-focus-scope
  https://github.com/cloudflare/a11y-focus-scope

  Copyright (c) 2015, CloudFlare, Inc.
  All rights reserved.
*/

const tabbable = require('tabbable');
const focusin = require('focusin');

let polyfilled = false;

function init(element, findTabbable) {
  // lazily polyfill focusin for firefox
  if (!polyfilled) {
    focusin.polyfill();
    polyfilled = true;
  }

  function focus() {
    const focusTarget = findTabbable ? tabbable(element)[0] : element;
    focusTarget.focus();
  }

  function onFocusIn(event) {
    if (element !== event.target && !element.contains(event.target)) {
      focus();
    }
  }

  if (findTabbable) focus();

  // $FlowFixMe: internal conflict in the flow definition of document.addEventListener
  document.addEventListener('focusin', onFocusIn);

  return function teardown() {
    // $FlowFixMe: internal conflict in the flow definition of document.removeEnvent
    document.removeEventListener('focusin', onFocusIn);
  };
}

let teardownFn;

exports.scopeFocus = function scopeFocus(
  element: HTMLElement,
  findTabbable: boolean,
) {
  if (teardownFn) teardownFn();
  teardownFn = init(element, findTabbable);
};

exports.unscopeFocus = function unscopeFocus() {
  if (teardownFn) teardownFn();
  teardownFn = null;
};
