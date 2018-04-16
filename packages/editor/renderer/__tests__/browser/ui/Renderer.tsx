import * as React from 'react';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import Renderer from '../../../src/ui/Renderer';

describe('@atlaskit/renderer/ui/Renderer', () => {
  it('should fire the validation error handler on unsupported content text', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const validationErrorCb = sinon.spy();

    const renderer = mount(
      <Renderer document={doc} onValidationError={validationErrorCb} />,
    );

    expect(
      validationErrorCb.calledWith({
        type: 'DocumentContent',
        nodes: [doc],
      }),
    ).to.be.true;

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
