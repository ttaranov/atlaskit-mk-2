import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Renderer from '../../../ui/Renderer';

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
});
