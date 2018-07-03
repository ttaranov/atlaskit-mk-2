import {
  doc,
  p,
  code_block,
  hardBreak,
  mention,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import { isMultiline } from '../../../../plugins/is-multiline-content';

describe('is-multiline-content plugin', () => {
  describe('#isMultiline', () => {
    it('should be true for documents with more than 1 child', () => {
      expect(isMultiline(doc(p(''), p(''))(defaultSchema))).toBe(true);
    });

    it('should be true if the first child in a documents is not a paragraph', () => {
      expect(isMultiline(doc(code_block()(''))(defaultSchema))).toBe(true);
    });

    it('should be true if a documents consist only of 1 paragraph with one or many hardBreak nodes inside', () => {
      expect(
        isMultiline(doc(p('text', hardBreak(), 'text'))(defaultSchema)),
      ).toBe(true);
    });

    it('should return false for documents with just 1 paragraph', () => {
      expect(isMultiline(doc(p('text'))(defaultSchema))).toBe(false);
    });

    it('should return false for documents with 1 paragraph and a lot of content inside that paragraph', () => {
      expect(
        isMultiline(
          doc(
            p(
              'Labore officia dolor non anim laboris consectetur minim deserunt quis excepteur cupidatat. Sit ea incididunt laborum voluptate laborum exercitation ullamco. Laboris amet elit ex nisi voluptate ipsum et excepteur consequat.',
              mention({ text: 'mention', id: 'mentionid' })(),
            ),
          )(defaultSchema),
        ),
      ).toBe(false);
    });
  });
});
