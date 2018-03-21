import * as React from 'react';

import FullPage from '../../src/ui/Appearance/FullPage';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import { mount } from 'enzyme';

const editor = (doc: any) =>
  createEditor({
    doc,
  });

describe('full page editor', () => {
  it('should create empty terminal empty paragraph when clicked outside editor', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    const fullPage = mount(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    const fullPage = mount(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 })
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal paragraph when clicked inside editor', () => {
    const { editorView } = editor(doc(p('Hello world')));
    mount(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    (editorView.dom as HTMLElement).click();
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  it('should create paragraph correctly when clicked outside and then inside the editor in sequence', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    const fullPage = mount(
      <FullPage
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    (editorView.dom as HTMLElement).click();
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
    fullPage
      .findWhere(elm => elm.name() === 'ClickWrapper')
      .simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });
});
