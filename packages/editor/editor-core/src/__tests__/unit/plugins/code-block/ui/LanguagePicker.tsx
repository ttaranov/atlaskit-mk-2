import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';

import { TrashToolbarButton } from '../../../../../plugins/code-block/ui/LanguagePicker/styles';
import LanguagePickerWithOutsideListeners, {
  LanguagePicker,
  LanguagePickerWithIntl,
} from '../../../../../plugins/code-block/ui/LanguagePicker';
import { analyticsService } from '../../../../../analytics';

describe('@atlaskit/editor-core/ui/LanguagePicker', () => {
  let languagePicker: ReactWrapper<any, any>;
  let setLanguageStub;
  let deleteCodeBlockStub;
  let dom: HTMLElement;

  beforeEach(() => {
    setLanguageStub = jest.fn();
    deleteCodeBlockStub = jest.fn();
    dom = document.createElement('div');
    languagePicker = mountWithIntl(
      <LanguagePickerWithIntl
        activeCodeBlockDOM={dom}
        deleteCodeBlock={deleteCodeBlockStub}
        setLanguage={setLanguageStub}
      />,
    );
  });

  afterEach(() => {
    languagePicker.unmount();
  });

  describe('Tracking selection', () => {
    it('should track the selected language', () => {
      const trackSpy = jest.spyOn(analyticsService, 'trackEvent');
      const onChange: Function = languagePicker.find(Select).prop('onChange');
      onChange({
        label: 'Javascript',
        value: 'javascript',
      });
      expect(trackSpy).toHaveBeenCalledWith(
        'atlassian.editor.codeblock.language.set',
        { language: 'javascript' },
      );
    });
  });

  describe('#shouldComponentUpdate', () => {
    it('should not re-render if setLanguage prop changes', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      languagePicker.setProps({ setLanguage: () => {} });
      expect(renderSpy).toHaveBeenCalledTimes(0);
    });

    it('should not re-render if deleteCodeBlock prop changes', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      languagePicker.setProps({ deleteCodeBlock: () => {} });
      expect(renderSpy).toHaveBeenCalledTimes(0);
    });

    it('should not re-render if activeCodeBlockDOM height/width has not changed', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      languagePicker.setProps({ activeCodeBlockDOM: dom });
      expect(renderSpy).toHaveBeenCalledTimes(0);
    });

    it('should re-render if activeLanguage prop changes', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      languagePicker.setProps({ activeLanguage: 'javascript' });
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should re-render if activeCodeBlockDOM prop changes', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      languagePicker.setProps({ activeCodeBlockDOM: document.head });
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should re-render if activeCodeBlockDOM width has changed', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      Object.defineProperty(dom, 'clientWidth', { value: 100 });
      languagePicker.setProps({ activeCodeBlockDOM: dom });
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should re-render if activeCodeBlockDOM height has changed', () => {
      const renderSpy = jest.spyOn(languagePicker.instance(), 'render');
      Object.defineProperty(dom, 'clientHeight', { value: 100 });
      languagePicker.setProps({ activeCodeBlockDOM: dom });
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#render', () => {
    it('should call deleteCodeBlock when trash icon clicked', () => {
      expect(deleteCodeBlockStub).toHaveBeenCalledTimes(0);
      languagePicker
        .find(TrashToolbarButton)
        .find(Button)
        .simulate('click');
      expect(deleteCodeBlockStub).toHaveBeenCalledTimes(1);
    });

    it('should show active language by default in select', () => {
      languagePicker.setProps({ activeLanguage: 'javascript' });
      const defaultValue = languagePicker.find(Select).prop('value');
      expect(defaultValue).toEqual({
        label: 'JavaScript',
        value: 'javascript',
      });
    });

    it('should call setLanguage when dropdown item selected', () => {
      expect(setLanguageStub).toHaveBeenCalledTimes(0);
      languagePicker.find(Select).instance();
      const onChange: Function = languagePicker.find(Select).prop('onChange');
      onChange({
        label: 'Javascript',
        value: 'javascript',
      });
      expect(setLanguageStub).toHaveBeenCalledTimes(1);
      expect(setLanguageStub).toHaveBeenCalledWith('javascript');
    });
  });
});

describe('@atlaskit/editor-core/ui/LanguagePickerWithOutsideListeners', () => {
  let wrapper: ReactWrapper;
  let instance: LanguagePickerWithOutsideListeners;
  const getElementInsideToolbar = () =>
    wrapper
      .find(LanguagePicker)
      .find(Select)
      .getDOMNode() as HTMLElement;
  beforeEach(() => {
    wrapper = mountWithIntl(
      <LanguagePickerWithOutsideListeners
        activeCodeBlockDOM={document.body}
        deleteCodeBlock={jest.fn()}
        setLanguage={jest.fn()}
        isEditorFocused
      />,
    );
    instance = wrapper.instance() as LanguagePickerWithOutsideListeners;
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should show the toolbar when the editor is focused', () => {
    wrapper.setProps({ isEditorFocused: true });
    expect(wrapper.find(LanguagePicker).exists()).toBe(true);
  });

  it('should not show the toolbar when the editor has lost focus', () => {
    wrapper.setProps({ isEditorFocused: false });
    expect(wrapper.find(LanguagePicker).exists()).toBe(false);
  });

  it('should keep showing the toolbar if toolbar clicked before editor has lost focus', () => {
    // invoke click handler directly since enzyme & EventListeners don't play nice
    instance.handleClick({ target: getElementInsideToolbar() } as any);
    wrapper.setProps({ isEditorFocused: false });
    expect(wrapper.find(LanguagePicker).exists()).toBe(true);
  });

  it('should hide toolbar if user clicks outside when `isToolbarFocused` is true', () => {
    wrapper.setState({ isToolbarFocused: true });
    wrapper.setProps({ isEditorFocused: false });
    instance.handleClick({ target: document.head } as any);
    wrapper.update();
    expect(wrapper.find(LanguagePicker).exists()).toBe(false);
  });
});
