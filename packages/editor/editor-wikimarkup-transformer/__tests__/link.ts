import {
  doc,
  p,
  a as link,
  code_block,
  img,
} from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('link with inline macro', () => {
    const WIKI_NOTATION = `[http://www.my{color:red}host{color}.com]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com' })('http://www.myhost.com'))),
    );
  });

  describe('coloured link', () => {
    const WIKI_NOTATION = `[{color:red}Text{color}|http://www.myhost.com]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com' })('Text'))),
    );
  });

  describe('link tooltip', () => {
    const WIKI_NOTATION = `[Text|http://www.myhost.com|{color:red}Tooltip{color}]`;

    // @TODO ADF doesn't support coloured links, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(link({ href: 'http://www.myhost.com', title: 'Tooltip' })('Text'))),
    );
  });

  describe('noformat link', () => {
    const WIKI_NOTATION = `[http://www.my{noformat}host{noformat}.com]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('[http://www.my'), code_block({})('host'), p('.com]')),
    );
  });

  describe('in image macro', () => {
    const WIKI_NOTATION = `!http://example.com/?{color}insection{color}!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          img({
            src:
              'http://example.com/?%3Cfont+color%3D%22%22%3Einsection%3C%2Ffont%3E',
          })(),
        ),
      ),
    );
  });

  describe('noformat in image macro', () => {
    const WIKI_NOTATION = `!http://example.com/?{noformat}insection{noformat}!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('!http://example.com/?'), code_block({})('insection'), p('!')),
    );
  });

  describe('image macro with file', () => {
    const WIKI_NOTATION = `!http://example.com/|fake=[file://z:/onerror=alert(/not_fixed/)//]!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/' })())),
    );
  });

  describe('image macro with external link', () => {
    const WIKI_NOTATION = `[!http://example.com/?insection!|http://www.myhost.com]`;

    // @TODO ADF doesn't support custom linkable images, confirm with JIRA
    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/?insection' })())),
    );
  });

  describe('link with image macro as title', () => {
    const WIKI_NOTATION = `[Text|http://www.myhost.com|!http://example.com/?insection!"]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          link({
            href: 'http://www.myhost.com',
            title: '!http://example.com/?insection!"',
          })('Text'),
        ),
      ),
    );
  });

  describe('inside a noformat', () => {
    const WIKI_NOTATION = `{noformat}[Text|http://www.myhost.com]{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code_block({})('[Text|http://www.myhost.com]'))),
    );
  });

  describe('image macro inside a color macro', () => {
    const WIKI_NOTATION = `{color}!http://example.com/?insection!{color}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(img({ src: 'http://example.com/?insection' })())),
    );
  });

  describe('image macro inside a noformat', () => {
    const WIKI_NOTATION = `{noformat}!http://example.com/?insection!{noformat}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p(code_block({})('!http://example.com/?insection!'))),
    );
  });
});
