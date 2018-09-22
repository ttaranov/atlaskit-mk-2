import * as React from 'react';
import { shallow } from 'enzyme';
import { createEditor, doc, p, a } from '@atlaskit/editor-test-helpers';
import HyperlinkToolbar, {
  EditLinkHrefToolbarWithIntl,
  AddDisplayTextToolbarWithIntl,
  InsertLinkToolbarWithIntl,
  ActivityPoweredInsertLinkToolbarWithIntl,
} from '../../../../../plugins/hyperlink/ui';
import { stateKey as hyperlinkStateKey } from '../../../../../plugins/hyperlink/pm-plugins/main';
import { showLinkToolbar } from '../../../../../plugins/hyperlink/commands';

const editor = doc => createEditor({ doc });

describe('@atlaskit/editor-core/ui/HyperlinkToolbar', () => {
  it('should render a EditLinkHrefToolbar when link mark has text different to href', () => {
    const { editorView: view } = editor(doc(p(a({ href: 'a' })('li{<>}nk'))));
    const pluginState = hyperlinkStateKey.getState(view.state);
    const wrapper = shallow(
      <HyperlinkToolbar view={view} hyperlinkState={pluginState} />,
    );
    const toolbar = wrapper.find(EditLinkHrefToolbarWithIntl);
    expect(toolbar).toHaveLength(1);
    expect(toolbar.prop('pos')).toEqual(1);
    expect(toolbar.prop('node')).toEqual(view.state.doc.nodeAt(1));
  });

  it('should render a AddDisplayTextToolbar when link mark has text different to href', () => {
    const { editorView: view } = editor(
      doc(p(a({ href: 'link' })('li{<>}nk'))),
    );
    const pluginState = hyperlinkStateKey.getState(view.state);
    const wrapper = shallow(
      <HyperlinkToolbar view={view} hyperlinkState={pluginState} />,
    );
    const toolbar = wrapper.find(AddDisplayTextToolbarWithIntl);
    expect(toolbar).toHaveLength(1);
    expect(toolbar.prop('pos')).toEqual(1);
    expect(toolbar.prop('node')).toEqual(view.state.doc.nodeAt(1));
  });

  it('should render a InsertLinkToolbar when cursor is not in a link', () => {
    const { editorView: view } = editor(doc(p('{<}hello{>}')));
    showLinkToolbar()(view.state, view.dispatch);
    const pluginState = hyperlinkStateKey.getState(view.state);
    const wrapper = shallow(
      <HyperlinkToolbar view={view} hyperlinkState={pluginState} />,
    );
    const toolbar = wrapper.find(InsertLinkToolbarWithIntl);

    expect(toolbar).toHaveLength(1);
    expect(toolbar.prop('from')).toEqual(1);
    expect(toolbar.prop('to')).toEqual(6);
  });

  it('should render a ActivityPoweredInsertLinkToolbar when cursor is not in a link & activity provider present', () => {
    const { editorView: view } = editor(doc(p('{<}hello{>}')));
    showLinkToolbar()(view.state, view.dispatch);
    const pluginState = hyperlinkStateKey.getState(view.state);
    const wrapper = shallow(
      <HyperlinkToolbar
        view={view}
        hyperlinkState={pluginState}
        activityProvider={new Promise(() => {})}
      />,
    );
    const toolbar = wrapper.find(ActivityPoweredInsertLinkToolbarWithIntl);

    expect(toolbar).toHaveLength(1);
    expect(toolbar.prop('from')).toEqual(1);
    expect(toolbar.prop('to')).toEqual(6);
  });
});
