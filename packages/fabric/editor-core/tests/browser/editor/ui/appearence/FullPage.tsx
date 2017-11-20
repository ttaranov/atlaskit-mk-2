import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import Editor from '../../../../../src/editor/ui/Appearance/FullPage';
import ProviderFactory from '../../../../../src/providerFactory';

describe('@atlaskit/editor-core/editor/plugins/FullPage', () => {

  const providerFactory = new ProviderFactory();

  it('should have Editor component defined', () => {
    const editor = mount(<Editor providerFactory={providerFactory}/>);
    expect(editor).to.not.equal(undefined);
  });
});
