import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  createEditor,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import ToolbarDecision from '../../../../../plugins/tasks-and-decisions/ui/ToolbarDecision';
import tasksAndDecisionsPlugin from '../../../../../plugins/tasks-and-decisions';

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
    const toolbarOption = mountWithIntl(
      <ToolbarDecision editorView={editorView} isDisabled={true} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });
});
