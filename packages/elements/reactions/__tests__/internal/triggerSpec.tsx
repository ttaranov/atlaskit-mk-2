import * as chai from 'chai';
import * as React from 'react';
import * as sinon from 'sinon';
import Button from '@atlaskit/button';

import { mount, shallow } from 'enzyme';
import Trigger from '../../src/internal/trigger';

const { expect } = chai;

const noop = () => {};

describe('@atlaskit/reactions/trigger', () => {
  it('should render a button', () => {
    const trigger = shallow(<Trigger onClick={noop} />);
    expect(trigger.find(Button).length).to.equal(1);
  });

  it('should add "miniMode" css-class when miniMode is true', () => {
    const trigger = shallow(<Trigger miniMode={true} onClick={noop} />);
    expect(trigger.hasClass('miniMode')).to.equal(true);
  });

  it('should call "onClick" when clicked', () => {
    const onClick = sinon.spy();
    const trigger = mount(<Trigger onClick={onClick} />);
    trigger.simulate('click');
    expect(onClick.called).to.equal(true);
  });

  it('should disable button', () => {
    const onClick = sinon.spy();
    const trigger = mount(<Trigger onClick={onClick} disabled />);
    trigger.find(Button).simulate('click');
    expect(onClick.called).to.equal(false);
  });
});
