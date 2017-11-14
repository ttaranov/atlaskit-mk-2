import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { default as ProviderFactory, WithProviders } from '../../../src/providerFactory';

describe('WithProviders', () => {
  it('should pass multiple providers to UI component', () => {
    const renderNode = (providers) => <div/>;
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('providerA', Promise.resolve());
    providerFactory.setProvider('providerB', Promise.resolve());

    const component = mount(<WithProviders providers={['providerA', 'providerB']} providerFactory={providerFactory} renderNode={renderNode}/>);
    const providers = component.state('providers');
    const nonEmptyProviders = Object.keys(providers).filter(providerName => providers[providerName]);

    expect(nonEmptyProviders).to.have.length(2);
    component.unmount();
  });
});
