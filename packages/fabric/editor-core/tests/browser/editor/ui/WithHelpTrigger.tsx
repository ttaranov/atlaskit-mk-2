import { name } from '../../../../package.json';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import WithHelpTrigger from '../../../../src/editor/ui/WithHelpTrigger';
import EditorContext from '../../../../src/editor/ui/EditorContext';

describe(name, () => {

  describe('WithHelpTrigger', () => {
    it('should render child component as is', () => {
      const dummy = () => <div>test</div>;
      const wrapper = mount(<EditorContext><WithHelpTrigger render={dummy} /></EditorContext>);
      expect(wrapper.html()).to.equal('<div>test</div>');
      wrapper.unmount();
    });

    it('should pass function openHelp as parameter to render method', () => {
      const stub = sinon.stub();
      stub.returns(<div>test</div>);
      const wrapper = mount(
        <EditorContext>
          <WithHelpTrigger render={stub} />
        </EditorContext>);
      expect(stub.called).to.equal(true);
      expect(stub.getCall(0).args.length).to.equal(1);
      wrapper.unmount();
    });
  });
});
