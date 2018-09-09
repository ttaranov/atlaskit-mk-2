import { Slice } from 'prosemirror-model';
import { defaultSchema, doc, p, strong } from '@atlaskit/editor-test-helpers';

import { toJSON } from '../../../../utils';
import {
  filterContentByType,
  filterSliceByType,
} from '../../../../utils/filter/filter';

describe('@atlaskit/editor-core/utils/filter', () => {
  describe('filterContentByType', () => {
    it('filtering by type', () => {
      const jsonDoc = toJSON(doc(p('some text'))(defaultSchema));
      const content = filterContentByType(jsonDoc, new Set(['text']));
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
      ]);
    });

    it('marks preserved', () => {
      const jsonDoc = toJSON(doc(p('some ', strong('text')))(defaultSchema));
      const content = filterContentByType(jsonDoc, new Set(['text']));
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some ',
        },
        {
          type: 'text',
          text: 'text',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ]);
    });
    it('filtering multiple paragraphs add breaks', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = filterContentByType(
        jsonDoc,
        new Set(['text']),
        defaultSchema,
        true,
      );
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'some other text',
        },
      ]);
    });
    it('filtering multiple paragraphs does not breaks when option false', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = filterContentByType(
        jsonDoc,
        new Set(['text']),
        defaultSchema,
        false,
      );
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
        {
          type: 'text',
          text: 'some other text',
        },
      ]);
    });
  });
  describe('filterSliceByType', () => {
    it('filtering by type', () => {
      const jsonDoc = toJSON(doc(p('some text'))(defaultSchema));
      const content = filterSliceByType(
        Slice.fromJSON(defaultSchema, { content: jsonDoc.content }),
        new Set(['text']),
        defaultSchema,
        false,
      );
      expect((content.toJSON() as any).content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
      ]);
    });

    it('marks preserved', () => {
      const jsonDoc = toJSON(doc(p('some ', strong('text')))(defaultSchema));
      const content = filterSliceByType(
        Slice.fromJSON(defaultSchema, { content: jsonDoc.content }),
        new Set(['text']),
        defaultSchema,
        false,
      );
      expect((content.toJSON() as any).content).toEqual([
        {
          type: 'text',
          text: 'some ',
        },
        {
          type: 'text',
          text: 'text',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ]);
    });
    it('filtering multiple paragraphs add breaks', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = filterSliceByType(
        Slice.fromJSON(defaultSchema, { content: jsonDoc.content }),
        new Set(['text']),
        defaultSchema,
        true,
      );
      expect((content.toJSON() as any).content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'some other text',
        },
      ]);
    });
    it('filtering multiple paragraphs does not breaks when option false', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = filterSliceByType(
        Slice.fromJSON(defaultSchema, { content: jsonDoc.content }),
        new Set(['text']),
        defaultSchema,
        false,
      );
      expect((content.toJSON() as any).content).toEqual([
        {
          type: 'text',
          text: 'some text',
        },
        {
          type: 'text',
          text: 'some other text',
        },
      ]);
    });
  });
});
