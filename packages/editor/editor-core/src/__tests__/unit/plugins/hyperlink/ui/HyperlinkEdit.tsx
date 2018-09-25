import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import HyperlinkEdit from '../../../../../plugins/hyperlink/ui/HyperlinkEdit';

describe('@atlaskit/editor-core/ui/HyperlinkEdit', () => {
  it('should render a PanelTextInput', () => {
    const wrapper = mountWithIntl(
      <HyperlinkEdit target={document.body} placeholder="Test" />,
    );
    const input = wrapper.find('PanelTextInput');
    expect(input.exists()).toBe(true);
    expect(input.prop('placeholder')).toEqual('Test');
  });

  it('should pass through the default value to the PanelTextInput', () => {
    const wrapper = mountWithIntl(
      <HyperlinkEdit
        target={document.body}
        placeholder="Test"
        defaultValue="D-Value"
      />,
    );
    const input = wrapper.find('PanelTextInput');
    expect(input.exists()).toBe(true);
    expect(input.prop('defaultValue')).toEqual('D-Value');
  });

  it('should override open-link href when alwaysOpenLink at is given', () => {
    const wrapper = mountWithIntl(
      <HyperlinkEdit
        target={document.body}
        placeholder="Test"
        alwaysOpenLinkAt="google.com"
        defaultValue="example.com"
        onOpenLink={() => {}}
      />,
    );
    const button = wrapper.find('ToolbarButton');
    expect(button.exists()).toBe(true);
    expect(button.prop('href')).toEqual('google.com');
  });
});
