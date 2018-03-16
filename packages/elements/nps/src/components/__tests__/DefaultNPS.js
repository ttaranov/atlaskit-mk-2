// @flow
import React from 'react';
import { shallow } from 'enzyme';
import DefaultNPS from '../DefaultNPS';
import NPS from '../NPS';

const getDefaultProps = () => ({
  product: 'Stride',
  canClose: true,
  canOptOut: true,
  onClose: jest.fn(),
  onOptOut: jest.fn(),
  onRatingSelect: jest.fn(),
  onCommentChange: jest.fn(),
  onRoleSelect: jest.fn(),
  onCanContactChange: jest.fn(),
  onFeedbackSubmit: jest.fn(),
  onFollowupSubmit: jest.fn(),
  onFinish: jest.fn(),
});

const getDefaultNPS = (props: any) => <DefaultNPS {...props} />;

describe('NPS', () => {
  it('should render an NPS', () => {
    const wrapper = shallow(getDefaultNPS(getDefaultProps()));
    expect(wrapper.find(NPS).exists()).toBe(true);
  });
});
