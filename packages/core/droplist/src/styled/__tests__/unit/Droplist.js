// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { Content } from '../../Droplist';

describe('Dropbox content', () => {
  it('renders correctly with default styles', () => {
    expect(shallow(<Content />)).toMatchSnapshot();
  });

  it('renders max-height "90vh" when isTall is true', () => {
    // $FlowFixMe - https://github.com/facebook/flow/issues/396
    expect(shallow(<Content isTall />)).toHaveStyleRule('max-height', '90vh');
  });

  it('renders max-height "317.5px" when isTall is false', () => {
    // $FlowFixMe - https://github.com/facebook/flow/issues/396
    expect(shallow(<Content isTall={false} />)).toHaveStyleRule(
      'max-height',
      '317.5px',
    );
  });

  it('renders max-height "350px" when maxHeight is 350', () => {
    // $FlowFixMe - https://github.com/facebook/flow/issues/396
    expect(shallow(<Content maxHeight={350} />)).toHaveStyleRule(
      'max-height',
      '350px',
    );
  });
});
