import { expect } from 'chai';
import { Slice } from 'prosemirror-model';
import {
  defaultSchema,
  doc,
  emoji,
  hardBreak,
  mention,
  p,
} from '@atlaskit/editor-test-helpers';

import { toJSON } from '../../../../src/utils';
import {
  taskDecisionDocFilter,
  taskDecisionSliceFilter,
} from '../../../../src/utils/filter';

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
            }),
            hardBreak(),
            ' and mention ',
            mention({ id: 'id', text: 'mention name' })
          )
        )
      );
      const content = taskDecisionDocFilter(jsonDoc);
      expect(content).to.deep.equal([
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
<<<<<<< HEAD
          attrs: { id: 'id', text: 'mention name' },
=======
          attrs: { id: 'id', text: 'mention name', accessLevel: '' },
>>>>>>> FS-1388 - Handle pasting of multi block content into an action or decision by seperating into text with hard breaks
        },
      ]);
    });
    it('filtering multiple paragraphs add breaks', () => {
      const jsonDoc = toJSON(doc(p('some text'), p('some other text')));
      const content = taskDecisionDocFilter(jsonDoc, defaultSchema);
      expect(content).to.deep.equal([
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
            }),
            hardBreak(),
            ' and mention ',
            mention({ id: 'id', text: 'mention name' })
          )
        )
      );
      const content = taskDecisionSliceFilter(
        Slice.fromJSON(defaultSchema, jsonDoc),
        defaultSchema
      ).toJSON()!.content;
      expect(content).to.deep.equal([
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
      const jsonDoc = toJSON(doc(p('some text'), p('some other text')));
      const content = taskDecisionSliceFilter(
        Slice.fromJSON(defaultSchema, jsonDoc),
        defaultSchema
      ).toJSON()!.content;
      expect(content).to.deep.equal([
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
