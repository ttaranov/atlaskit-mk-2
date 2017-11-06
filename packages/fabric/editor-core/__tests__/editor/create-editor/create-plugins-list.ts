import { helpDialogPlugin } from '../../../src/editor/plugins';
import { tablePlugin } from '../../../src/editor/plugins';
import createPluginsList from '../../../src/editor/create-editor/create-plugins-list';

describe('createPluginsList', () => {
  it('should add helpDialogPligin if allowHelpDialog is true', () => {
    const plugins = createPluginsList({ allowHelpDialog: true });
    expect(plugins.indexOf(helpDialogPlugin) > -1).toBe(true);
  });

  it('should add tablePlugin if allowTables is true', () => {
    const plugins = createPluginsList({ allowTables: true });
    expect(plugins.indexOf(tablePlugin) > -1).toBe(true);
  });
});
