import { name } from '../../../../package.json';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import Editor from '../../../../src/editor';
import CollapsedEditor from '../../../../src/editor/ui/CollapsedEditor';
import ChromeCollapsed from '../../../../src/ui/ChromeCollapsed';

describe(name, () => {

  describe('CollapsedEditor', () => {

    it('should not render the editor when isExpanded is false', () => {
      const wrapper = mount(<CollapsedEditor isExpanded={false}><Editor /></CollapsedEditor>);
      expect(wrapper.find(Editor).exists()).to.equal(false);
      expect(wrapper.find(ChromeCollapsed).exists()).to.equal(true);
    });

    it('should render the editor when isExpanded is true', () => {
      const wrapper = mount(<CollapsedEditor isExpanded={true}><Editor /></CollapsedEditor>);
      expect(wrapper.find(Editor).exists()).to.equal(true);
      expect(wrapper.find(ChromeCollapsed).exists()).to.equal(false);
    });

    it('should call onFocus when collapsed editor is clicked', () => {
      const onFocus = sinon.spy();
      const wrapper = mount(<CollapsedEditor onFocus={onFocus}><Editor /></CollapsedEditor>);
      wrapper.find(ChromeCollapsed).simulate('focus');
      expect(onFocus.callCount).to.equal(1);
    });

    it('should not call onExpand when the editor is initially expanded', () => {
      const onExpand = sinon.spy();
      mount(<CollapsedEditor isExpanded={true} onExpand={onExpand}><Editor /></CollapsedEditor>);
      expect(onExpand.callCount).to.equal(0);
    });

    it('should call onExpand after the editor is expanded and mounted', () => {
      const onExpand = sinon.spy();
      const wrapper = mount(<CollapsedEditor isExpanded={false} onExpand={onExpand}><Editor /></CollapsedEditor>);
      wrapper.setProps({ isExpanded: true });
      expect(onExpand.callCount).to.equal(1);
    });

    it('should allow setting a ref on the editor component', () => {
      let editorRef = {};
      const setRef = ref => { editorRef = ref; };
      mount(<CollapsedEditor isExpanded={true} ><Editor ref={setRef} /></CollapsedEditor>);
      expect(editorRef instanceof Editor).to.equal(true);
    });
  });
});
