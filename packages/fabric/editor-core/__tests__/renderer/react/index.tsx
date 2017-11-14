import { mount } from 'enzyme';
import * as sinon from 'sinon';
import ReactSerializer from '../../../src/renderer/react';
import schema from '../../../../stories/schema';
import * as validator from '@atlaskit/renderer';

const doc = {
  'type': 'doc',
  'content': [
    {
      'type': 'paragraph',
      'content': [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com'
              }
            }
          ]
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'strong'
            },
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com'
              }
            }
          ]
        },
      ]
    }
  ]
};

const docFromSchema = schema.nodeFromJSON(doc);

describe('Renderer - ReactSerializer', () => {

  describe('serializeFragment', () => {

    it('should render document', () => {
      const reactSerializer = ReactSerializer.fromSchema(schema);
      const reactDoc = mount(reactSerializer.serializeFragment(docFromSchema.content) as any);

      const root = reactDoc.find('div');
      const paragraph = root.find('p');
      const link = paragraph.find('a');
      const strong = link.find('strong');

      expect(root.length).toEqual(1);
      expect(paragraph.length).toEqual(1);
      expect(link.length).toEqual(1);
      expect(strong.length).toEqual(1);

      expect(link.text()).toEqual('Hello, World!');
      expect(link.props()).toHaveProperty('href', 'https://www.atlassian.com');
      expect(strong.text()).toEqual('World!');
      reactDoc.unmount();
    });

  });

  describe('buildMarkStructure', () => {

    const { strong } = schema.marks;

    it('should wrap text nodes with marks', () => {

      const textNodes = [
        schema.text('Hello '),
        schema.text('World!', [strong.create()])
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output[0].type.name).toEqual('text');
      expect((output[0] as any).text).toEqual('Hello ');
      expect(output[1].type.name).toEqual('strong');
      expect((output[1] as any).content[0].type.name).toEqual('text');
      expect((output[1] as any).content[0].text).toEqual('World!');
    });
  });

  describe('getMarks', () => {
    const { strong, strike, underline } = schema.marks;
    const node = schema.text('Hello World', [strong.create(), strike.create(), underline.create()]);

    it('should call getMarksByOrder', () => {
      const spy = sinon.spy(validator, 'getMarksByOrder');
      ReactSerializer.getMarks(node);
      expect(spy.calledWith(node.marks)).toBe(true);
    });
  });

});
