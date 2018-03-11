import { mount } from 'enzyme';
import * as React from 'react';
import ToolbarDecision from '../../src/ui/ToolbarDecision';
import { doc, p, createEditor } from '@atlaskit/editor-test-helpers';
import ToolbarButton from '../../src/ui/ToolbarButton';
import { ProviderFactory } from '@atlaskit/editor-common';
import tasksAndDecisionsPlugin from '../../src/editor/plugins/tasks-and-decisions';

describe('@atlaskit/editor-core/ui/ToolbarDecision', () => {
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [tasksAndDecisionsPlugin],
    });

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should be disabled if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarDecision editorView={editorView} isDisabled={true} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
