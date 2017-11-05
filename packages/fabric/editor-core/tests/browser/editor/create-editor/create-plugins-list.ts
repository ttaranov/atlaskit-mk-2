import { expect } from 'chai';
import { helpDialogPlugin } from '../../../../src/editor/plugins';
import createPluginsList from '../../../../src/editor/create-editor/create-plugins-list';

describe('createPluginsList', () => {
  it('should add helpDialogPligin if allowHelpDialog is true', () => {
    const plugins = createPluginsList({ allowHelpDialog : true });
    expect(plugins.indexOf(helpDialogPlugin) > -1).to.equal(true);
  });
});
