import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Renderer from '../../../ui/Renderer';

const validDoc = {
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

describe('@atlaskit/renderer/ui/Renderer', () => {
  it('should catch errors and render unsupported content text', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const renderer = mount(<Renderer document={doc} />);
    expect(renderer.find('UnsupportedBlockNode')).to.have.length(1);
    renderer.unmount();
  });

  describe('Stage0', () => {
    const docWithStage0Mark = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
              marks: [
                {
                  type: 'confluenceInlineComment',
                  attrs: {
                    reference: 'ref',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
      const renderer = mount(<Renderer document={docWithStage0Mark} />);
      expect(renderer.find('ConfluenceInlineComment')).to.have.length(0);
      renderer.unmount();
    });

    it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
      const renderer = mount(
        <Renderer document={docWithStage0Mark} adfStage="stage0" />,
      );
      expect(renderer.find('ConfluenceInlineComment')).to.have.length(1);
      renderer.unmount();
    });
  });

  describe('Truncated Renderer', () => {
    it('should truncate to 95px when truncated prop is true and maxHeight is undefined', () => {
      const renderer = mount(<Renderer truncated={true} document={validDoc} />);

      expect(renderer.find('TruncatedWrapper')).to.have.length(1);

      const wrapper = renderer.find('TruncatedWrapper').childAt(0);
      expect(wrapper.props().height).to.equal(95);
      renderer.unmount();
    });

    it('should truncate to custom height when truncated prop is true and maxHeight is defined', () => {
      const renderer = mount(
        <Renderer truncated={true} maxHeight={100} document={validDoc} />,
      );
      expect(renderer.find('TruncatedWrapper')).to.have.length(1);
      expect(renderer.find('TruncatedWrapper').props().height).to.equal(100);

      renderer.unmount();
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is defined", () => {
      const renderer = mount(<Renderer maxHeight={100} document={validDoc} />);
      expect(renderer.find('TruncatedWrapper')).to.have.length(0);
      renderer.unmount();
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is undefined", () => {
      const renderer = mount(<Renderer document={validDoc} />);
      expect(renderer.find('TruncatedWrapper')).to.have.length(0);
      renderer.unmount();
    });
  });
});
