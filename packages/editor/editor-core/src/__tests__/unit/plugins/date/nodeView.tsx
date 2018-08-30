import * as React from 'react';
import { mount } from 'enzyme';
import {
  createEditor,
  doc,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers';
import { insertDate } from '../../../../plugins/date/actions';
import datePlugin from '../../../../plugins/date';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
import DateNodeView from '../../../../plugins/date/nodeviews/date';
import { uuid } from '@atlaskit/editor-common';

describe('date plugin', () => {
  beforeEach(() => {
    uuid.setStatic('local-decision');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [datePlugin, tasksAndDecisionsPlugin],
    });
  };

  describe('DateNodeView', () => {
    it('should set color to red for past dates in action item', () => {
      const { editorView: view } = editor(
        doc(
          taskList({ localId: 'local-highlight' })(
            taskItem({ localId: 'local-highlight' })('Hello World {<>}'),
          ),
        ),
      );
      const date = new Date();
      insertDate({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate() - 2,
      })(view.state, view.dispatch);
      const dateNode = mount(
        <DateNodeView
          view={view}
          node={view.state.selection.$from.nodeBefore!}
        />,
      );
      expect(
        dateNode.findWhere(n => n.prop('color') === 'red').length,
      ).toBeGreaterThan(1);
    });

    it('should not set color to red for past dates in completed action item', () => {
      const { editorView: view } = editor(
        doc(
          taskList({ localId: 'local-highlight' })(
            taskItem({ localId: 'local-highlight', state: 'DONE' })(
              'Hello World {<>}',
            ),
          ),
        ),
      );
      const date = new Date();
      insertDate({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate() - 2,
      })(view.state, view.dispatch);
      const dateNode = mount(
        <DateNodeView
          view={view}
          node={view.state.selection.$from.nodeBefore!}
        />,
      );
      expect(dateNode.find(n => n.prop('color') === 'red').length).toEqual(0);
    });
  });
});
