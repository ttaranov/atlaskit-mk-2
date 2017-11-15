import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProviderFactory from '../../../src/providerFactory';
import Macro from '../../../src/ui/Macro';
import MacroComponent from '../../../src/ui/Macro/MacroComponent';
import { doc, panel, p, makeEditor } from '@atlaskit/editor-test-helpers';
import { macroProviderPromise } from '../../../example-helpers/mock-macro-provider';
import { inlineMacroData } from '../../../example-helpers/mock-macro-data';

describe('@atlaskit/editor-core/ui/Macro', () => {
  const editor = (doc: any) => makeEditor({ doc });
  const node = inlineMacroData[0] as any;

  it('should render macro component', async (done) => {
    const { editorView } = editor(doc(panel(p('te{<>}xt'))));
    const macro = mount(<Macro editorView={editorView} node={node} />);
    const macroComponent = macro.find(MacroComponent);
    expect(macroComponent.prop('node')).to.equal(node);
    macro.unmount();
  });

  it('should pass macroProvider into MacroComponent', async (done) => {
    const { editorView } = editor(doc(panel(p('te{<>}xt'))));
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('macroProvider', macroProviderPromise);

    const macro = mount(<Macro editorView={editorView} node={node} providerFactory={providerFactory}/>);
    const macroComponent = macro.find(MacroComponent);

    expect(macroComponent.prop('macroProvider')).to.equal(macroProviderPromise);
    macro.unmount();
  });

  it('should render placeholder image if macroProvider is set', () => {
    const { editorView } = editor(doc(panel(p('te{<>}xt'))));
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('macroProvider', macroProviderPromise);

    const macro = mount(<Macro editorView={editorView} node={node} providerFactory={providerFactory}/>);
    expect(macro.find(`img`)).to.have.length(1);
    macro.unmount();
  });
});
