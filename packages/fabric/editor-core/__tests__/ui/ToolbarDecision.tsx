import { mount } from 'enzyme';
import * as React from 'react';
import taskDecisionPlugins from '../../src/plugins/tasks-and-decisions';
import ToolbarDecision from '../../src/ui/ToolbarDecision';
import {
  doc,
  p,
  makeEditor,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import ToolbarButton from '../../src/ui/ToolbarButton';
import ProviderFactory from '../../src/providerFactory';

describe('@atlaskit/editor-core/ui/ToolbarDecision', () => {
  const providerFactory = new ProviderFactory();
  const editor = (doc: any) =>
    makeEditor<any>({
      doc,
      plugins: taskDecisionPlugins(defaultSchema, {}, providerFactory),
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
