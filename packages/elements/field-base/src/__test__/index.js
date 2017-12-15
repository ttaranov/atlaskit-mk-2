// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import InlineDialog from '@atlaskit/inline-dialog';
import Spinner from '@atlaskit/spinner';

import FieldBase, { FieldBaseStateless } from '@atlaskit/field-base';

import { ChildWrapper, Content } from '../styled/Content';
import { WarningIcon } from '../components/ValidationElement';

const defaultProps = {
  onFocus: () => {},
  onBlur: () => {},
  onIconClick: () => {},
};

describe('ak-field-base', () => {
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('properties', () => {
    describe('by default', () =>
      it('should render a content', () =>
        expect(
          shallow(<FieldBaseStateless {...defaultProps} />).find(Content)
            .length,
        ).toBeGreaterThan(0)));

    describe('isReadOnly prop = true', () =>
      it('should render with the readOnly prop', () =>
        expect(
          shallow(<FieldBaseStateless {...defaultProps} isReadOnly />)
            .find(Content)
            .prop('readOnly'),
        ).toBe(true)));

    describe('isFocused prop = true', () => {
      it('should render the content with the isFocused prop', () =>
        expect(
          shallow(<FieldBaseStateless {...defaultProps} isFocused />)
            .find(Content)
            .prop('isFocused'),
        ).toBe(true));
    });

    describe('is{p}addingDisabled prop = true', () => {
      it('should render the content with the paddingDisabled prop', () =>
        expect(
          shallow(<FieldBaseStateless {...defaultProps} isPaddingDisabled />)
            .find(Content)
            .prop('paddingDisabled'),
        ).toBe(true));
    });

    describe('isInvalid prop = true', () => {
      it('should render with the isFocused styles and not the isInvalid styles', () => {
        const Invalid = mount(
          <FieldBaseStateless {...defaultProps} isInvalid />,
        );
        expect(Invalid.find(Content).prop('invalid')).toBe(true);
        expect(Invalid.find(WarningIcon).length).toBeGreaterThan(0);
      });

      it('should render the warning icon', () =>
        expect(
          mount(<FieldBaseStateless {...defaultProps} isInvalid />).find(
            WarningIcon,
          ).length,
        ).toBeGreaterThan(0));
    });

    describe('isDisabled prop = true AND isInvalid prop = true', () => {
      it('should not render the warning icon', () =>
        expect(
          shallow(
            <FieldBaseStateless {...defaultProps} isDisabled isInvalid />,
          ).find(WarningIcon).length,
        ).toBe(0));
    });

    describe('invalidMessage prop', () => {
      it('should be reflected to the inline dialog content', () => {
        const stringContent = 'invalid msg content';
        expect(
          shallow(
            <FieldBaseStateless
              {...defaultProps}
              invalidMessage={stringContent}
            />,
          )
            .find(InlineDialog)
            .props().content,
        ).toBe(stringContent);
      });
    });

    describe('isFocused prop = true AND isInvalid prop = true', () => {
      it('should render with the isFocused styles and not the isInvalid styles', () => {
        const wrapper = shallow(
          <FieldBaseStateless {...defaultProps} isFocused isInvalid />,
        );
        expect(wrapper.find(Content).prop('isFocused')).toBe(true);
        expect(wrapper.find(Content).prop('invalid')).toBe(false);
      });
    });

    describe('isCompact prop = true', () => {
      it('should render the content with the compact prop', () => {
        const wrapper = shallow(
          <FieldBaseStateless {...defaultProps} isCompact />,
        );
        expect(wrapper.find(ChildWrapper).props().compact).toBe(true);
        expect(wrapper.find(Content).props().compact).toBe(true);
      });
    });

    describe('isDialogOpen prop', () => {
      it('reflects value to InlineDialog isOpen if invalidMessage prop is provided', () => {
        const wrapper = shallow(
          <FieldBaseStateless
            {...defaultProps}
            isDialogOpen
            invalidMessage="test"
          />,
        );
        expect(wrapper.find(InlineDialog).props().isOpen).toBe(true);
      });

      it('reflects value to InlineDialog isOpen if invalidMessage prop is not provided', () => {
        const wrapper = shallow(
          <FieldBaseStateless {...defaultProps} isDialogOpen />,
        );
        expect(wrapper.find(InlineDialog).props().isOpen).toBe(false);
      });
    });

    describe('appearance', () => {
      it('should render the content with the subtle attribute', () =>
        expect(
          shallow(<FieldBaseStateless {...defaultProps} appearance="subtle" />)
            .find(Content)
            .prop('subtle'),
        ).toBe(true));
    });

    describe('shouldReset', () =>
      it('should call onBlur when set', () => {
        const spy = jest.fn();
        const wrapper = mount(
          <FieldBaseStateless {...defaultProps} onBlur={spy} />,
        );
        wrapper.setProps({ shouldReset: true });
        expect(spy).toHaveBeenCalled();
      }));

    describe('isLoading', () => {
      it('should render Spinner', () => {
        const wrapper = mount(
          <FieldBaseStateless {...defaultProps} isLoading />,
        );
        expect(wrapper.find(Spinner).length).toBe(1);
        wrapper.setProps({ isLoading: false });
        expect(wrapper.find(Spinner).length).toBe(0);
      });

      describe('and isInvalid', () =>
        it('should not render Spinner', () => {
          const wrapper = mount(
            <FieldBaseStateless {...defaultProps} isLoading isInvalid />,
          );
          expect(wrapper.find(Spinner).length).toBe(0);
        }));
    });
  });

  describe('focus behaviour', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<FieldBaseStateless {...defaultProps} />);
      wrapper.find(Content).simulate('focus');
    });

    it('should call onFocus', () => {
      const spy = jest.fn();
      wrapper = mount(<FieldBaseStateless {...defaultProps} onFocus={spy} />);
      wrapper.find(Content).simulate('focus');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur', () => {
      const spy = jest.fn();
      wrapper = mount(<FieldBaseStateless {...defaultProps} onBlur={spy} />);
      wrapper.find(Content).simulate('blur');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('smart component', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const isDialogOpened = wrapper => wrapper.find(InlineDialog).prop('isOpen');

    const openDialog = wrapper => {
      expect(isDialogOpened(wrapper)).toBe(false);
      wrapper.find(Content).simulate('focus'); // open the dialog
      expect(isDialogOpened(wrapper)).toBe(true);
    };

    it('should call onFocus handler', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldBase onFocus={spy} />);
      wrapper.find(Content).simulate('focus');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur handler', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldBase onBlur={spy} />);
      wrapper.find(Content).simulate('blur');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should close the dialog when focus goes away from both the element and the dialog', () => {
      const invalidMessage = <snap className="errorMessage">foo</snap>;
      const wrapper = mount(<FieldBase invalidMessage={invalidMessage} />);

      openDialog(wrapper);
      wrapper.find('.errorMessage').simulate('focus');

      wrapper.find('.errorMessage').simulate('blur');
      wrapper.find(Content).simulate('blur');

      jest.runTimersToTime(10);

      expect(isDialogOpened(wrapper)).toBe(false);
    });

    it('should retain focus when blur and focus happen one by one', () => {
      const wrapper = mount(<FieldBase {...defaultProps} />);
      const contentContainer = wrapper.find(Content);
      contentContainer.simulate('blur'); // this should be robust enough to handle even two
      // "blur" events, one by one (faced it in the browser)
      contentContainer.simulate('blur');
      contentContainer.simulate('focus');

      jest.runTimersToTime(10);

      expect(wrapper.state('isFocused')).toBe(true);
    });
  });
});
