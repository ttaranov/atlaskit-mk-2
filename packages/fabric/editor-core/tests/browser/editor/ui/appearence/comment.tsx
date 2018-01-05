import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import Editor from '../../../../../src/editor/ui/Appearance/Comment';
import { ProviderFactory } from '@atlaskit/editor-common';

describe('@atlaskit/editor-core/editor/plugins/Comment', () => {
  const providerFactory = new ProviderFactory();

  it('should have Editor component defined', () => {
    const editor = mount(<Editor providerFactory={providerFactory} />);
    expect(editor).to.not.equal(undefined);
  });
});
