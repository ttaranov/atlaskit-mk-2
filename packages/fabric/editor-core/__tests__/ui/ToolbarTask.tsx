import { mount } from 'enzyme';
import * as React from 'react';
import { doc, p, createEditor } from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';
import ToolbarTask from '../../src/ui/ToolbarTask';
import ToolbarButton from '../../src/ui/ToolbarButton';
import tasksAndDecisionsPlugin from '../../src/editor/plugins/tasks-and-decisions';

describe('@atlaskit/editor-core/ui/ToolbarTask', () => {
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) =>
    createEditor<any>({
      doc,
      editorPlugins: [tasksAndDecisionsPlugin],
    });

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should be disabled if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarTask editorView={editorView} isDisabled={true} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
