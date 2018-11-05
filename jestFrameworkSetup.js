/* eslint-disable */
import 'jest-styled-components';
import snakeCase from 'snake-case';
import { toMatchSnapshot } from 'jest-snapshot';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import * as emotion from 'emotion';
import { createSerializer } from 'jest-emotion';

let consoleError;
let consoleWarn;
let consoleLog;

// URL is not available for non Node environment
if (global.URL) {
  global.URL.createObjectURL = () => 'mock result of URL.createObjectURL()';
  global.URL.revokeObjectURL = () => 'mock result of URL.revokeObjectURL()';
}

if (!global.WEBSITE_ENV) {
  global.WEBSITE_ENV = 'local';
}

// Node promise rejection are now logged for debbugging
process.on('unhandledRejection', reason => {
  console.log('REJECTION', reason);
});

/*
  This file is executed after the test framework is setup for each test file. Addons that modify
  the `expect` object can be applied here.
  @see https://facebook.github.io/jest/docs/configuration.html#setuptestframeworkscriptfile-string
*/
const pmModel = require('./node_modules/prosemirror-model');
const diff = require('./node_modules/jest-diff');

/**
 * Polyfill DOMElement.innerText because JSDOM lacks support for it.
 * @link https://github.com/tmpvar/jsdom/issues/1245
 */
/**
 * We're checking the document actually exists here because tests using `jest-styled-components`
 * need to be run with `testEnvironment=node` for `styled-components@^1`
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
if (
  typeof document !== 'undefined' &&
  !('innerText' in document.createElement('a'))
) {
  const getInnerText = node =>
    Array.prototype.slice.call(node.childNodes).reduce((text, child) => {
      if (child.nodeType === child.TEXT_NODE) {
        return `${text}${child.textContent}`;
      }

      if (child.childNodes.length) {
        return `${text}${getInnerText(child)}`;
      }

      return text;
    }, '');

  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: false,
    enumerable: true,
    get: function get() {
      return getInnerText(this);
    },
    set: function set(text) {
      const textNodes = Array.prototype.slice
        .call(this.childNodes)
        .filter(node => node.nodeType === node.TEXT_NODE);

      // If there's only one child that is a text node, update it
      if (textNodes.length === 1) {
        textNodes[0].textContent = text;
        return;
      }

      // Remove all child nodes as per WHATWG LS Spec
      Array.prototype.slice
        .call(this.childNodes)
        .forEach(node => this.removeChild(node));

      // Append a single text child node with the text
      this.appendChild(this.ownerDocument.createTextNode(text));
    },
  });
}

/**
 * We're checking the window actually exists here because tests using `jest-styled-components`
 * need to be run with `testEnvironment=node` for `styled-components@^1`
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
if (typeof window !== 'undefined' && !('cancelAnimationFrame' in window)) {
  window.cancelAnimationFrame = () => {
    if (!window.hasWarnedAboutCancelAnimationFramePolyfill) {
      window.hasWarnedAboutCancelAnimationFramePolyfill = true;
      console.warn(
        'Warning! Test uses DOM cancelAnimationFrame API which is not available in JSDOM/Node environment.',
      );
    }
  };
}

function isNodeOrFragment(thing) {
  // Using a simple `instanceof` check is intentionally avoided here to make
  // this code agnostic to a specific instance of a Schema.
  return thing && typeof thing.eq === 'function';
}

function transformDoc(fn) {
  return doc => {
    const walk = fn => node => {
      const { content = [], ...rest } = node;
      const transformedNode = fn(rest);
      const walkWithFn = walk(fn);
      if (content.length) {
        transformedNode.content = content.map(walkWithFn);
      }
      return transformedNode;
    };
    return walk(fn)(doc);
  };
}

const hasLocalId = type =>
  type === 'taskItem' ||
  type === 'taskList' ||
  type === 'decisionItem' ||
  type === 'decisionList';

const removeIdsFromDoc = transformDoc(node => {
  /**
   * Replace `id` of media nodes with a fixed id
   * @see https://regex101.com/r/FrYUen/1
   */
  if (node.type === 'media') {
    return {
      ...node,
      attrs: {
        ...node.attrs,
        id: node.attrs.id.replace(
          /(temporary:)?([a-z0-9\-]+)(:.*)?$/,
          '$11234-5678-abcd-efgh$3',
        ),

        __key: node.attrs.__key.replace(
          /(temporary:)?([a-z0-9\-]+)(:.*)?$/,
          '$11234-5678-abcd-efgh$3',
        ),

        __fileName: 'example.png',
      },
    };
  }
  if (hasLocalId(node.type)) {
    return {
      ...node,
      attrs: {
        ...node.attrs,
        localId: node.attrs.localId.replace(/([a-z0-9\-]+)/, () => 'abc-123'),
      },
    };
  }
  return node;
});

/* eslint-disable no-undef */
expect.extend({
  toEqualDocument(actual, expected) {
    // Because schema is created dynamically, expected value is a function (schema) => PMNode;
    // That's why this magic is necessary. It simplifies writing assertions, so
    // instead of expect(doc).toEqualDocument(doc(p())(schema)) we can just do:
    // expect(doc).toEqualDocument(doc(p())).
    //
    // Also it fixes issues that happens sometimes when actual schema and expected schema
    // are different objects, making this case impossible by always using actual schema to create expected node.
    expected =
      typeof expected === 'function' && actual.type && actual.type.schema
        ? expected(actual.type.schema)
        : expected;

    if (
      !(expected instanceof pmModel.Node) ||
      !(actual instanceof pmModel.Node)
    ) {
      return {
        pass: false,
        actual,
        expected,
        name: 'toEqualDocument',
        message:
          'Expected both values to be instance of prosemirror-model Node.',
      };
    }

    if (expected.type.schema !== actual.type.schema) {
      return {
        pass: false,
        actual,
        expected,
        name: 'toEqualDocument',
        message: 'Expected both values to be using the same schema.',
      };
    }

    const pass = this.equals(actual.toJSON(), expected.toJSON());
    const message = pass
      ? () =>
          `${this.utils.matcherHint('.not.toEqualDocument')}\n\n` +
          `Expected JSON value of document to not equal:\n  ${this.utils.printExpected(
            expected,
          )}\n` +
          `Actual JSON:\n  ${this.utils.printReceived(actual)}`
      : () => {
          const diffString = diff(expected, actual, {
            expand: this.expand,
          });
          return (
            `${this.utils.matcherHint('.toEqualDocument')}\n\n` +
            `Expected JSON value of document to equal:\n${this.utils.printExpected(
              expected,
            )}\n` +
            `Actual JSON:\n  ${this.utils.printReceived(actual)}` +
            `${diffString ? `\n\nDifference:\n\n${diffString}` : ''}`
          );
        };

    return {
      pass,
      actual,
      expected,
      message,
      name: 'toEqualDocument',
    };
  },

  toMatchDocSnapshot(actual) {
    const { currentTestName, snapshotState } = this;

    const removeFirstWord = sentence =>
      sentence
        .split(' ')
        .slice(1)
        .join(' ');

    // this change is to ensure we are mentioning test file name only once in snapshot file
    // for integration tests only
    const newTestName = removeFirstWord(currentTestName);

    // remove ids that may change from the document so snapshots are repeatable
    const transformedDoc = removeIdsFromDoc(actual);

    // since the test runner fires off multiple browsers for a single test, map each snapshot to the same one
    // (otherwise we'll try to create as many snapshots as there are browsers)
    const oldCounters = snapshotState._counters;
    snapshotState._counters = Object.create(oldCounters, {
      set: {
        value: key => oldCounters.set(key, 1),
      },
      get: {
        value: key => oldCounters.get(key),
      },
    });

    // In `jest-snapshot@22`, passing the optional testName doesn't override test name anymore.
    // Instead it appends the passed name with original name.
    const oldTestName = this.currentTestName;
    this.currentTestName = newTestName;

    const ret = toMatchSnapshot.call(this, transformedDoc);

    this.currentTestName = oldTestName;
    return ret;
  },
});

// Copied from react-beautiful-dnd/test/setup.js
if (typeof document !== 'undefined') {
  // overriding these properties in jsdom to allow them to be controlled
  Object.defineProperties(document.documentElement, {
    clientWidth: {
      writable: true,
      value: document.documentElement.clientWidth,
    },
    clientHeight: {
      writable: true,
      value: document.documentElement.clientHeight,
    },
    scrollWidth: {
      writable: true,
      value: document.documentElement.scrollWidth,
    },
    scrollHeight: {
      writable: true,
      value: document.documentElement.scrollHeight,
    },
  });
}

// Setting initial viewport
// Need to set clientWidth and clientHeight as jsdom does not set these properties
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.documentElement.clientWidth = window.innerWidth;
  document.documentElement.clientHeight = window.innerHeight;
}

if (process.env.CI) {
  beforeEach(() => {
    consoleError = console.error;
    consoleWarn = console.warn;
    consoleLog = console.log;
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = consoleError;
    console.warn = consoleWarn;
    console.log = consoleLog;
  });
}

expect.addSnapshotSerializer(createSerializer(emotion));

// set up for visual regression
if (process.env.VISUAL_REGRESSION) {
  const puppeteer = require('puppeteer');
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

  beforeAll(async () => {
    // show browser when watch is enabled
    const isWatch = process.env.WATCH === 'true';
    let headless = true;
    if (isWatch) {
      headless = false;
    }
    global.browser = await puppeteer.launch({
      // run test in headless mode
      headless: headless,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    global.page = await global.browser.newPage();
  }, jasmine.DEFAULT_TIMEOUT_INTERVAL);

  afterAll(async () => {
    await global.browser.close();
  });

  // TODO tweak failureThreshold to provide best results
  // TODO: A failureThreshold of 1 will pass tests that have > 2 percent failing pixels
  const toMatchProdImageSnapshot = configureToMatchImageSnapshot({
    customDiffConfig: { threshold: 0.2 },
    failureThreshold: '5',
    failureThresholdType: 'percent',
    noColors: true,
  });

  expect.extend({ toMatchProdImageSnapshot });
}
