import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import ProviderFactory from '../../../../src/providerFactory';
import PluginSlot from '../../../../src/editor/ui/PluginSlot';

describe('@atlaskit/editor-core/editor/plugins/PluginSlot', () => {

  const providerFactory = new ProviderFactory();

  it('should have PluginSlot component defined', () => {
    expect(PluginSlot).to.not.equal(undefined);
  });

  it('should editorWidth defined in props', () => {
    const editor = mount(<PluginSlot providerFactory={providerFactory} appearance="full-page" editorWidth={100} />);
    expect(editor.prop('editorWidth')).to.equal(100);
  });
});
