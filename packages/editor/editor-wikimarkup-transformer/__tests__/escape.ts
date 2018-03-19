import { doc, p } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('escaping bold and italic', () => {
    const WIKI_NOTATION = `This is not \\\\*bold\\\\* neither this one \\\\_italic\\\\_`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not &#42;bold&#42; neither this one &#95;italic&#95;')),
    );
  });

  describe('escaping links', () => {
    const WIKI_NOTATION = `This is not a link \\\\[spaceKey:pageTitle\\\\]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not a link [spaceKey:pageTitle]')),
    );
  });

  describe('escaping diffs', () => {
    const WIKI_NOTATION = `This is not \\\\+inserted\\\\+ neither this one \\\\-deleted\\\\-`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('This is not &#43;inserted&#43; neither this one &#45;deleted&#45;'),
      ),
    );
  });

  describe('escaping escapes', () => {
    const WIKI_NOTATION = `This is not an\\\\escaped\\\\phase as well as this \\\\ one!`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(p('This is not an\\\\escaped\\\\phase as well as this \\\\ one!')),
    );
  });

  describe('escaping many escapes', () => {
    const WIKI_NOTATION = `Not an \\\\\\\\\\\\\\\\\\\\\\\\*escaped phrase\\\\\\\\\\\\\\\\\\\\\\\\*`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          'Not an \\\\\\\\\\\\\\\\\\\\\\\\*escaped phrase\\\\\\\\\\\\\\\\\\\\\\\\*',
        ),
      ),
    );
  });

  describe('escaping mentions', () => {
    const WIKI_NOTATION = `Not \\\\@textbox\\\\@ and especially not an \\\\@-sign by itself`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('Not &#64;textbox&#64; and especially not an &#64;-sign by itself'),
      ),
    );
  });
});
