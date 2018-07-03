import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DecisionList as AkDecisionList } from '@atlaskit/task-decision';
import DecisionList from '../../../../react/nodes/decisionList';

describe('Renderer - React/Nodes/DecisionList', () => {
  it('should wrap content with <AkDecisionList>-tag with start prop', () => {
    const text: any = 'This is a list item';
    const decisionListWrapper = shallow(<DecisionList>{text}</DecisionList>);
    const decisionList = decisionListWrapper.childAt(0);
    expect(decisionListWrapper.is('div')).to.equal(true);
    expect(decisionList.is(AkDecisionList)).to.equal(true);
  });

  it('should not render if no children', () => {
    const decisionList = shallow(<DecisionList />);
    expect(decisionList.isEmptyRender()).to.equal(true);
  });
});
