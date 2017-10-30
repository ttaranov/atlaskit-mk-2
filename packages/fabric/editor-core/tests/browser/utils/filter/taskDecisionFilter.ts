import { expect } from 'chai';
import {
  doc, emoji, hardBreak, mention, p
} from '../../../../src/test-helper';

import { toJSON } from '../../../../src/utils';
import { taskDecisionDocFilter } from '../../../../src/utils/filter';

describe('@atlaskit/editor-core/utils/filter', () => {
  describe('taskDecisionDocFilter', () => {
    it('filter preserves supported types', () => {
      const jsonDoc = toJSON(
        doc(
          p(
            'some text ',
            emoji({ shortName: ':cheese:', id: 'cheese', fallback: ':cheese:'}),
            hardBreak(),
            ' and mention ',
            mention({ id: 'id', text: 'mention name' }),
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
          attrs: { shortName: ':cheese:', id: 'cheese', text: ':cheese:'},
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
          attrs: { id: 'id', text: 'mention name', accessLevel: '' }
        }
      ]);
    });
  });
});
