//@flow
import React from 'react';
import { shallow } from 'enzyme';
import FieldTextArea from '@atlaskit/field-text-area';
import Button, { ButtonGroup } from '@atlaskit/button';
import Feedback, { CommentBox, SendButton, RatingsButtons } from '../Feedback';
import { Header, Description } from '../common';
import { Comment } from '../styled/feedback';
import { ButtonWrapper } from '../styled/common';

describe('Feedback page', () => {
  describe('Component', () => {
    const getDefaultProps = () => ({
      messages: {
        title: 'A',
        description: 'B',
        optOut: 'C',
        scaleLow: 'D',
        scaleHigh: 'E',
        commentPlaceholder: 'F',
        done: 'G',
      },
      canClose: true,
      canOptOut: true,
      onClose: jest.fn(),
      onOptOut: jest.fn(),
      onRatingSelect: jest.fn(),
      onCommentChange: jest.fn(),
      onSubmit: jest.fn(),
    });

    beforeEach(() => {});
    it('should render a header', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      expect(wrapper.find(Header).exists()).toBe(true);
    });

    it('should render a description', () => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      const desc = wrapper.find(Description);
      expect(desc.exists()).toBe(true);
      expect(
        desc
          .children()
          .first()
          .text(),
      ).toEqual(props.messages.description);
    });

    it('should render RatingsButtons', done => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.instance().setState({ rating: 2 }, () => {
        wrapper.update();
        const ratingsButtons = wrapper.find(RatingsButtons);
        expect(ratingsButtons.exists()).toBe(true);
        expect(ratingsButtons.prop('selected')).toEqual(2);
        done();
      });
    });

    it('should render a comment box and send button if state.rating is not null', done => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.instance().setState({ rating: 2 }, () => {
        wrapper.update();
        expect(wrapper.find(CommentBox).exists()).toBe(true);
        expect(wrapper.find(SendButton).exists()).toBe(true);
        done();
      });
    });

    it('should not render a comment box or send button if state.rating is not null', done => {
      const props = getDefaultProps();
      const wrapper = shallow(<Feedback {...props} />);
      wrapper.instance().setState({ rating: null }, () => {
        wrapper.update();
        expect(wrapper.find(CommentBox).exists()).toBe(false);
        expect(wrapper.find(SendButton).exists()).toBe(false);
        done();
      });
    });

    describe('onRatingSelect', () => {
      it('should call the onRatingSelect prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Feedback {...props} />);
        const instance = wrapper.instance();

        instance.onRatingSelect(2);
        expect(props.onRatingSelect).toHaveBeenCalledWith(2);
      });
    });

    describe('onCommentChange', () => {
      it('should call the onCommentChange prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Feedback {...props} />);
        const instance = wrapper.instance();

        instance.onCommentChange('a');
        expect(props.onCommentChange).toHaveBeenCalledWith('a');
      });
    });

    describe('onSubmit', () => {
      it('should call the onSubmit prop', () => {
        const props = getDefaultProps();
        const wrapper = shallow(<Feedback {...props} />);
        const instance = wrapper.instance();
        instance.onSubmit();
        expect(props.onSubmit).toHaveBeenCalledWith({
          rating: null,
          comment: '',
        });
      });
    });
  });

  describe('CommentBox', () => {
    const placeholder = 'Put ya comment';
    let onCommentChange;

    beforeEach(() => {
      onCommentChange = jest.fn();
    });

    const getCommentBox = () => (
      <CommentBox placeholder={placeholder} onCommentChange={onCommentChange} />
    );

    it('should render a StyledComment', () => {
      const wrapper = shallow(getCommentBox());
      expect(wrapper.find(Comment).exists()).toBe(true);
    });

    it('should render a FieldTextArea', () => {
      const wrapper = shallow(getCommentBox());
      const el = wrapper
        .find(Comment)
        .find(FieldTextArea)
        .first();
      expect(el.exists()).toBe(true);
      expect(el.prop('placeholder')).toBe(placeholder);
      el.prop('onChange')({ target: { value: 2 } });
      expect(onCommentChange).toHaveBeenCalled();
    });
  });

  describe('SendButton', () => {
    const label = 'Send';
    let onClick;

    beforeEach(() => {
      onClick = jest.fn();
    });

    const getSendButton = () => (
      <SendButton sendLabel={label} onClick={onClick} />
    );

    it('should render a ButtonWrapper', () => {
      const wrapper = shallow(getSendButton());
      expect(wrapper.find(ButtonWrapper).exists()).toBe(true);
    });

    it('should render a Button', () => {
      const wrapper = shallow(getSendButton());
      const el = wrapper
        .find(ButtonWrapper)
        .find(Button)
        .first();
      expect(el.exists()).toBe(true);
      expect(el.prop('onClick')).toBe(onClick);
    });
  });

  describe('RatingsButtons', () => {
    let selected;
    let onRatingSelect;

    beforeEach(() => {
      selected = null;
      onRatingSelect = jest.fn();
    });

    const getRatingsButtons = props => (
      <RatingsButtons
        selected={selected}
        onRatingSelect={onRatingSelect}
        {...props}
      />
    );

    it('should render a button group', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(wrapper.find(ButtonGroup).exists()).toBe(true);
    });

    it('should render 11 buttons', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(wrapper.find(Button).getElements().length).toBe(11);
    });

    it('should render no selected button if selected is null', () => {
      const wrapper = shallow(getRatingsButtons());
      expect(
        wrapper
          .find(Button)
          .find('[isSelected=true]')
          .exists(),
      ).toBe(false);
    });

    it('should render one selected button if selected is not null', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(
        wrapper
          .find(Button)
          .find('[isSelected=true]')
          .getElements().length,
      ).toBe(1);
    });

    it('should call onRatingSelect callback when the selected rating is clicked', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(onRatingSelect).not.toHaveBeenCalled();
      const selectedButton = wrapper
        .find(Button)
        .find('[isSelected=true]')
        .first();
      selectedButton.simulate('click');
      expect(onRatingSelect).toHaveBeenCalledWith(1);
    });

    it('should call onRatingSelect callback when an unselected rating is clicked', () => {
      const wrapper = shallow(
        getRatingsButtons({
          selected: 1,
        }),
      );
      expect(onRatingSelect).not.toHaveBeenCalled();
      const selectedButton = wrapper.find(Button).findWhere(
        n =>
          n
            .children()
            .first()
            .text() === '5',
      );
      selectedButton.simulate('click');
      expect(onRatingSelect).toHaveBeenCalledWith(5);
    });
  });
});
