// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import FieldBase, { Label } from '@atlaskit/field-base';

import InlineEditStatelessWithAnalytics, {
  InlineEditStatelessWithoutAnalytics as InlineEditStateless,
} from '../../InlineEditStateless';
import FieldBaseWrapper from '../../styled/FieldBaseWrapper';

const noop = () => {};
const Input = props => <input {...props} onChange={noop} />;

const defaultProps = {
  label: 'test',
  isLabelHidden: false,
  isEditing: false,
  isInvalid: false,
  areActionButtonsHidden: false,
  isConfirmOnBlurDisabled: false,
  onConfirm: noop,
  onCancel: noop,
  onEditRequested: noop,
  readView: 'readView',
  editView: <Input value="test" />,
};

describe('@atlaskit/inline-edit', () => {
  it('should render read view inside FieldBase when in read mode', () => {
    const readView = <span>read</span>;
    const wrapper = mount(
      <InlineEditStateless {...defaultProps} readView={readView} />,
    );
    expect(wrapper.find(FieldBase).length).toBe(1);
    const fieldBase = wrapper.find(FieldBase);
    expect(fieldBase.contains(readView)).toBe(true);
  });

  it('should render edit view inside FieldBase when in editing mode', () => {
    const editView = <span>edit</span>;
    const wrapper = mount(
      <InlineEditStateless {...defaultProps} isEditing editView={editView} />,
    );
    expect(wrapper.find(FieldBase).length).toBe(1);
    const fieldBase = wrapper.find(FieldBase);
    expect(fieldBase.contains(editView)).toBe(true);
  });

  describe('read-only mode', () => {
    it('should render the read view when "false" is supplied as the edit view', () => {
      const readView = <span>read</span>;
      const wrapper = shallow(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          readView={readView}
          editView={false}
        />,
      );
      expect(wrapper.contains(readView)).toBe(true);
    });

    it('should render the read view when "null" is supplied as the edit view', () => {
      const readView = <span>read</span>;
      const wrapper = shallow(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          readView={readView}
          editView={null}
        />,
      );
      expect(wrapper.contains(readView)).toBe(true);
    });

    it('should render the read view when "undefined" is supplied as the edit view', () => {
      const readView = <span>read</span>;
      const wrapper = shallow(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          readView={readView}
          editView={undefined}
        />,
      );
      expect(wrapper.contains(readView)).toBe(true);
    });
  });

  describe('onEditRequested', () => {
    it('should be called when the read view is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} onEditRequested={spy} />,
      );
      wrapper.find(FieldBase).simulate('click');
      expect(spy).toHaveBeenCalled();
    });

    it('should not be called when the edit view is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          onEditRequested={spy}
        />,
      );
      wrapper.find(FieldBase).simulate('click');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onConfirm', () =>
    it('should be called when confirmation button is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} isEditing onConfirm={spy} />,
      );
      wrapper.find(ConfirmIcon).simulate('click');
      expect(spy).toHaveBeenCalled();
    }));

  describe('onCancel', () =>
    it('should be called when cancel button is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} isEditing onCancel={spy} />,
      );
      wrapper.find(CancelIcon).simulate('click');
      expect(spy).toHaveBeenCalled();
    }));

  describe('label', () => {
    it('should set parameter into FieldBase', () => {
      expect(
        shallow(<InlineEditStateless {...defaultProps} label="test" />)
          .find(Label)
          .prop('label'),
      ).toBe('test');
    });

    it('should set both isLabelHidden and label parameter into FieldBase', () => {
      const wrapper = shallow(
        <InlineEditStateless {...defaultProps} label="test" isLabelHidden />,
      );
      const fieldBase = wrapper.find(Label);
      expect(fieldBase.prop('label')).toBe('test');
      expect(fieldBase.prop('isLabelHidden')).toBe(true);
    });

    it('it should not call onClick if is read only', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineEditStateless
          {...defaultProps}
          label="test"
          onEditRequested={spy}
          editView={undefined}
        />,
      );
      const label = wrapper.find(Label);
      /**
       * We cannot use simulate here since the node that has the event handler is inside Label.
       *
       * Otherwise we will be exposing implementation details from FieldBase and also
       * we would be coupling this test to the current structure of FieldBase.
       *
       * So instead, we find the first node inside Label that has `onClick` and that it's not
       * the Label itself, and then we simulate the event on that node.
       **/
      const onClickNode = label
        .findWhere(n => n.prop('onClick') && !n.find(Label).exists())
        .at(0);
      onClickNode.simulate('click');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('isWaiting', () => {
    describe('when isEditing is false', () =>
      it('FieldBase should not have isLoading prop', () => {
        const wrapper = mount(
          <InlineEditStateless {...defaultProps} isWaiting />,
        );
        expect(wrapper.find(FieldBase).prop('isLoading')).toBe(false);
      }));

    describe('when isEditing is true', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(
          <InlineEditStateless {...defaultProps} isWaiting isEditing />,
        );
      });

      it('FieldBase should have prop isLoading', () =>
        expect(wrapper.find(FieldBase).prop('isLoading')).toBe(true));

      it('should disable field base', () =>
        expect(wrapper.find(FieldBase).prop('isDisabled', true)).not.toBe(
          undefined,
        ));
    });
  });

  describe('disableEditViewFieldBase', () => {
    it('should not wrap editView in a FieldBase when set to true', () => {
      const wrapper = mount(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          disableEditViewFieldBase
        />,
      );

      expect(wrapper.find(FieldBase).length).toBe(0);
    });

    it('should wrap editView in a FieldBase when set to false', () => {
      const wrapper = mount(
        <InlineEditStateless
          {...defaultProps}
          isEditing
          disableEditViewFieldBase={false}
        />,
      );

      expect(wrapper.find(FieldBase).length).toBe(1);
    });

    it('should default to false', () => {
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} isEditing />,
      );

      expect(wrapper.prop('disableEditViewFieldBase')).toBe(false);
    });
  });

  describe('invalidMessage prop', () => {
    it('should be reflected to the FieldBase', () => {
      expect(
        shallow(<InlineEditStateless {...defaultProps} invalidMessage="test" />)
          .find(FieldBase)
          .props().invalidMessage,
      ).toBe('test');
    });
  });

  describe('isInvalid prop', () => {
    it('should be reflected to the FieldBase', () => {
      expect(
        shallow(<InlineEditStateless {...defaultProps} isInvalid />)
          .find(FieldBase)
          .props().isInvalid,
      ).toBe(true);
    });
  });

  /* This suite can be enabled when we move to styled components v2 (new repo?) and we
   * can properly use jest-styled-components without disabling mount(...) calls
   */
  // eslint-disable-next-line jest/no-disabled-tests
  describe('field width', () => {
    it('should not stretch to container width in read mode by default', () => {
      const wrapper = mount(<InlineEditStateless {...defaultProps} />);

      expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
        'display',
        'inline-block',
      );
    });

    it('should stretch to container width in read mode when isFitContainerWidthReadView is set', () => {
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} isFitContainerWidthReadView />,
      );

      expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
        'display',
        'block',
      );
    });

    it('should stretch to container width when in edit mode', () => {
      const wrapper = mount(
        <InlineEditStateless {...defaultProps} isEditing />,
      );

      expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
        'display',
        'block',
      );
    });

    it('should have max-width so inline-block text overflow using ellipses', () => {
      const wrapper = mount(<InlineEditStateless {...defaultProps} />);

      expect(wrapper.find(FieldBaseWrapper)).toHaveStyleRule(
        'max-width',
        '100%',
      );
    });
  });
});

describe('InlineEditStatelessWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    const readView = <span>read</span>;
    mount(
      <InlineEditStatelessWithAnalytics
        {...defaultProps}
        readView={readView}
      />,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
