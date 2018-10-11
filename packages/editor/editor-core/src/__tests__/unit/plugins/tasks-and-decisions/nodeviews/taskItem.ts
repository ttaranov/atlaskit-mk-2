import { taskItem, defaultSchema } from '@atlaskit/editor-test-helpers';
import { taskItemNodeViewFactory } from '../../../../../plugins/tasks-and-decisions/nodeviews/taskItem';

describe('Task Item - NodeView', () => {
  const providerFactory = {} as any;
  const portalProviderAPI = { render() {}, remove() {} } as any;

  it('should render a contentDOM of `div` inside `li`', () => {
    const node = taskItem()('this is the task')(defaultSchema);

    const nodeView = taskItemNodeViewFactory(
      portalProviderAPI,
      providerFactory,
    )(node, null as any, () => -1);

    const contentDOM = nodeView!.contentDOM as HTMLElement;

    expect(contentDOM.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.tagName).toBe('LI');
  });
});
