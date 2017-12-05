// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { name } from '../package.json';
import PageHeader from '../src';

describe(name, () => {
  it('should render passed children', () => {
    const wrapper = shallow(<PageHeader>Title</PageHeader>);
    expect(wrapper.contains('Title')).toBe(true);
  });

  it('should render passed breadcrumbs', () => {
    const BreadCrumbs = () => <div>Breadcrumb</div>;
    const wrapper = shallow(
      <PageHeader breadcrumbs={<BreadCrumbs />}>Title</PageHeader>,
    );
    expect(wrapper.find(BreadCrumbs).length).toBe(1);
  });

  it('should render passed actions', () => {
    const Actions = () => <div>Breadcrumb</div>;
    const wrapper = shallow(
      <PageHeader actions={<Actions />}>Title</PageHeader>,
    );
    expect(wrapper.find(Actions).length).toBe(1);
  });

  it('should render passed bottom bar', () => {
    const Bar = () => <div>Breadcrumb</div>;
    const wrapper = shallow(<PageHeader bottomBar={<Bar />}>Title</PageHeader>);
    expect(wrapper.find(Bar).length).toBe(1);
  });
});
