import removeFileFromRecents from '../../removeFileFromRecents';
import {
  removeFileFromRecents as removeFileFromRecentsAction,
  RemoveFileFromRecentsAction,
} from '../../../actions/removeFileFromRecents';
import { mockState } from '../../../mocks';
import { State } from '../../../domain';

describe('removeFileFromRecents reducer', () => {
  let action: RemoveFileFromRecentsAction;
  let state: State;

  beforeEach(() => {
    action = removeFileFromRecentsAction('some-id', 'occurrence-key');
    state = {
      ...mockState,
      recents: {
        items: [
          {
            id: 'some-id',
            insertedAt: 42,
            occurrenceKey: 'some-other-occurrence-key',
            type: 'file',
            details: {} as any,
          },
          {
            id: 'other-id',
            insertedAt: 42,
            occurrenceKey: 'some-other-occurrence-key',
            type: 'file',
            details: {} as any,
          },
        ],
      },
      selectedItems: [
        {
          serviceName: 'some-service',
          mimeType: 'some-type',
          id: 'some-id',
          upfrontId: Promise.resolve('some-id'),
          name: 'some-name',
          size: 42,
          date: 44,
          occurrenceKey: 'some-other-occurrence-key',
        },
        {
          serviceName: 'some-other-service',
          mimeType: 'some-other-type',
          id: 'other-id',
          upfrontId: Promise.resolve('other-id'),
          name: 'some-other-name',
          size: 42,
          date: 44,
          occurrenceKey: 'some-other-occurrence-key',
        },
      ],
    };
    removeFileFromRecents(state, action);
  });

  it('should remove file from recents list', () => {
    expect(state.recents.items).toHaveLength(1);
    expect(state.recents.items[0].id).toEqual('other-id');
  });
  it('should remove item from selected list', () => {
    expect(state.selectedItems).toHaveLength(1);
    expect(state.selectedItems[0].id).toEqual('other-id');
  });
});
