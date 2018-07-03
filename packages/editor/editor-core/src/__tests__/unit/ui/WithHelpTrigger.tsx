import { name } from '../../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import WithHelpTrigger from '../../../ui/WithHelpTrigger';
import EditorContext from '../../../ui/EditorContext';

describe(name, () => {
  describe('WithHelpTrigger', () => {
    it('should render child component as is', () => {
      const dummy = () => <div>test</div>;
      const wrapper = mount(
        <EditorContext>
          <WithHelpTrigger render={dummy} />
        </EditorContext>,
      );
      expect(wrapper.html()).toEqual('<div>test</div>');
      wrapper.unmount();
    });

    it('should pass function openHelp as parameter to render method', () => {
      const stub = jest.fn();
      stub.mockImplementation(() => <div>test</div>);
      const wrapper = mount(
        <EditorContext>
          <WithHelpTrigger render={stub} />
        </EditorContext>,
      );
      expect(stub).toHaveBeenCalled();
      wrapper.unmount();
    });
  });
});
