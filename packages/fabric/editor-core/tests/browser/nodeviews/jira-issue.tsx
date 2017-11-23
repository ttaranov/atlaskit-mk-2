import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { JiraIcon } from '@atlaskit/logo';
import ReactJIRAIssueNode from '../../../src/nodeviews/ui/jira-issue';
import { confluenceJiraIssue } from '@atlaskit/editor-test-helpers';

describe('jiraIssue - React component', () => {
  it('should return a node of type span', () => {
    const node = confluenceJiraIssue({ issueKey: 'test' });
    const wrapper = mount(<ReactJIRAIssueNode node={node} />);
    expect(wrapper.getDOMNode().tagName).to.equal('SPAN');
    wrapper.unmount();
  });

  it('should use JiraLogo component', () => {
    const node = confluenceJiraIssue({ issueKey: 'test' });
    const wrapper = mount(<ReactJIRAIssueNode node={node} />);
    expect(wrapper.find(JiraIcon)).to.have.length(1);
    wrapper.unmount();
  });
});
