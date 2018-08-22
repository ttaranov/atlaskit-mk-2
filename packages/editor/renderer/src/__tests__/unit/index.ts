import * as assert from 'assert';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { renderDocument, Serializer } from '../../index';
import { defaultSchema as schema } from '@atlaskit/editor-common';
import * as common from '@atlaskit/editor-common';

const doc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
  ],
};

class MockSerializer implements Serializer<string> {
  serializeFragment(fragment: any) {
    return 'dummy';
  }
}

describe('Renderer', () => {
  describe('renderDocument', () => {
    const serializer = new MockSerializer();

    it('should call getValidDocument', () => {
      const spy = sinon.spy(common, 'getValidDocument');
      renderDocument(doc, serializer, schema);
      expect(spy.calledWith(doc)).to.equal(true);
    });

    it('should call schema.nodeFromJSON', () => {
      const spy = sinon.spy(schema, 'nodeFromJSON');
      renderDocument(doc, serializer, schema);
      expect(spy.called).to.equal(true);
    });

    it('should call serializer.serializeFragment', () => {
      const spy = sinon.spy(serializer, 'serializeFragment');
      renderDocument(doc, serializer, schema);
      expect(spy.called).to.equal(true);
    });

    it('should return result and stat fields', () => {
      const res = renderDocument(doc, serializer, schema);

      assert(res.result, 'Output is missing');
      assert(res.stat, 'Stat is missing');
    });

    it('should return null if document is invalid', () => {
      const unexpectedContent = [
        true,
        false,
        new Date(),
        '',
        1,
        [],
        {},
        {
          content: [{}],
        },
      ];

      unexpectedContent.forEach(content => {
        expect(renderDocument(content, serializer).result).to.equal(null);
      });
    });
  });
});
