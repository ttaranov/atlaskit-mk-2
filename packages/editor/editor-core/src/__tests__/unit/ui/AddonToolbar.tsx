import { name } from '../../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import DocumentIcon from '@atlaskit/icon/glyph/document';
import { AtlassianIcon } from '@atlaskit/logo';
import ToolbarButton from '../../../ui/ToolbarButton';
import { AddonConfiguration, AddonToolbar, Addon } from '../../../ui/Addon';

describe(name, () => {
  // tslint:disable-next-line:variable-name
  const AddonComponentExample = () => <span>pig</span>;

  const addonConfigs: AddonConfiguration[] = [
    {
      text: 'Item one',
      icon: <DocumentIcon label="Item 1" />,
      renderOnClick: closePopup => <AddonComponentExample />,
    },
    {
      text: 'Item two',
      icon: <AtlassianIcon label="Item 2" />,
      actionOnClick: editorActions => editorActions.clear(),
    },
  ];

  const addons = addonConfigs.map(
    ({ text, icon, actionOnClick, renderOnClick }, i) => (
      <Addon
        key={i}
        icon={icon}
        actionOnClick={actionOnClick}
        renderOnClick={renderOnClick}
      >
        {text as any}
      </Addon>
    ),
  );

  describe('AddonToolbar', () => {
    it('should render ToolbarButton', () => {
      const toolbar = mount(<AddonToolbar dropdownItems={addons} />);
      expect(toolbar.find(ToolbarButton).length).toEqual(1);
      toolbar.unmount();
    });

    it('should not render ToolbarButton if dropdownItems prop is missing', () => {
      const toolbar = mount(<AddonToolbar />);
      expect(toolbar.find(ToolbarButton).length).toEqual(0);
      toolbar.unmount();
    });
  });
});
