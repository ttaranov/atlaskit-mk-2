import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';
import DecisionItem from '../../../../react/nodes/decisionItem';

describe('Renderer - React/Nodes/DecisionItem', () => {
  const text: any = 'This is a list item';
  const listItem = shallow(<DecisionItem>{text}</DecisionItem>);

  it('should wrap content with <AkDecisionItem>-tag', () => {
    expect(listItem.is(AkDecisionItem)).to.equal(true);
  });

  it('should not render if no children', () => {
    const decisionItem = shallow(<DecisionItem />);
    expect(decisionItem.isEmptyRender()).to.equal(true);
  });
});
