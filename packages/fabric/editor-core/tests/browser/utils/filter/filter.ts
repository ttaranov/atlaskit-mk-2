import { expect } from 'chai';
import {
  doc, p, strong
} from '../../../../src/test-helper';

import { toJSON } from '../../../../src/utils';
import { filterContentByType } from '../../../../src/utils/filter/filter';

describe('@atlaskit/editor-core/utils/filter', () => {
  describe('filterContentByType', () => {
    it('filtering by type', () => {
      const jsonDoc = toJSON(
        doc(
          p(
            'some text'
          )
        )
      );
      const content = filterContentByType(jsonDoc, new Set(['text']));
      expect(content).to.deep.equal([
        {
          type: 'text',
          text: 'some text',
        }
      ]);
    });

    it('marks preserved', () => {
      const jsonDoc = toJSON(doc(p('some ', strong('text'))));
      const content = filterContentByType(jsonDoc, new Set(['text']));
      expect(content).to.deep.equal([
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
            }
          ]
        }
      ]);
    });
  });
});
