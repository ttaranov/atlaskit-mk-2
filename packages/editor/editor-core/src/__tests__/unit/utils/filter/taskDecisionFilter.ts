import { Slice } from 'prosemirror-model';
import {
  defaultSchema,
  doc,
  emoji,
  hardBreak,
  mention,
  p,
} from '@atlaskit/editor-test-helpers';

import { toJSON } from '../../../../utils';
import {
  taskDecisionDocFilter,
  taskDecisionSliceFilter,
} from '../../../../utils/filter';

describe('@atlaskit/editor-core/utils/filter', () => {
  describe('taskDecisionDocFilter', () => {
    it('filter preserves supported types', () => {
      const jsonDoc = toJSON(
        doc(
          p(
            'some text ',
            emoji({
              shortName: ':cheese:',
              id: 'cheese',
              fallback: ':cheese:',
            })(),
            hardBreak(),
            ' and mention ',
            mention({ id: 'id', text: 'mention name' })(),
          ),
        )(defaultSchema),
      );
      const content = taskDecisionDocFilter(jsonDoc);
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some text ',
        },
        {
          type: 'emoji',
          attrs: { shortName: ':cheese:', id: 'cheese', text: ':cheese:' },
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: ' and mention ',
        },
        {
          type: 'mention',
          attrs: { id: 'id', text: 'mention name', accessLevel: '' },
        },
      ]);
    });
    it('filtering multiple paragraphs add breaks', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = taskDecisionDocFilter(jsonDoc, defaultSchema);
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
  });
  describe('taskDecisionSliceFilter', () => {
    it('filter preserves supported types', () => {
      const jsonDoc = toJSON(
        doc(
          p(
            'some text ',
            emoji({
              shortName: ':cheese:',
              id: 'cheese',
              fallback: ':cheese:',
            })(),
            hardBreak(),
            ' and mention ',
            mention({ id: 'id', text: 'mention name' })(),
          ),
        )(defaultSchema),
      );
      const content = (taskDecisionSliceFilter(
        Slice.fromJSON(defaultSchema, jsonDoc),
        defaultSchema,
      ).toJSON() as any).content;
      expect(content).toEqual([
        {
          type: 'text',
          text: 'some text ',
        },
        {
          type: 'emoji',
          attrs: { shortName: ':cheese:', id: 'cheese', text: ':cheese:' },
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: ' and mention ',
        },
        {
          type: 'mention',
          attrs: {
            id: 'id',
            text: 'mention name',
            accessLevel: '',
            userType: null,
          },
        },
      ]);
    });
    it('filtering multiple paragraphs add breaks', () => {
      const jsonDoc = toJSON(
        doc(p('some text'), p('some other text'))(defaultSchema),
      );
      const content = (taskDecisionSliceFilter(
        Slice.fromJSON(defaultSchema, jsonDoc),
        defaultSchema,
      ).toJSON() as any).content;
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
  });
});
