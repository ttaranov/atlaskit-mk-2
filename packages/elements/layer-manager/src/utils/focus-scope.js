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

function init(element, findTabbable, callImmediately = true) {
  // lazily polyfill focusin for firefox
  if (!polyfilled) {
    focusin.polyfill();
    polyfilled = true;
  }

  function focus() {
    const els = tabbable(element);
    const focusTarget = findTabbable ? (els[0] || element) : element;

    if (typeof focusTarget.focus === 'function') focusTarget.focus();
  }

  function onFocusIn(e: Event) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    if (element !== target && !element.contains(target)) {
      focus();
    }
  }

  function onKeyDown(event: Event) {
    if (event.key !== 'Tab') return;

    const els = tabbable(element);
    const last = els[els.length - 1];

    if (element !== event.target && event.target === last) {
      event.preventDefault();
      focus();
    }
  }

  if (callImmediately) focus();

  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('keydown', onKeyDown);

  return function teardown() {
    document.removeEventListener('focusin', onFocusIn);
    document.removeEventListener('keydown', onKeyDown);
  };
}

let teardownFn;

exports.scopeFocus = function scopeFocus(element: Node, findTabbable: boolean) {
  if (teardownFn) teardownFn();
  teardownFn = init(element, findTabbable);
};

exports.unscopeFocus = function unscopeFocus() {
  if (teardownFn) teardownFn();
  teardownFn = null;
};
