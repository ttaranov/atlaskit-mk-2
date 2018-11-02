import removeFileFromRecents from '../../removeFileFromRecents';
import { removeFileFromRecents as removeFileFromRecentsAction } from '../../../actions/removeFileFromRecents';
import { mockState } from '../../../mocks';
import { State } from '../../../domain';

describe('removeFileFromRecents reducer', () => {
  let state: State;
  let resultState: State;

  beforeEach(() => {
    const removeFromRecents = removeFileFromRecentsAction(
      'some-id',
      'occurrence-key',
    );
    const removeFromLocalUploads = removeFileFromRecentsAction(
      'some-local-upfront-file-id',
      'occurrence-key',
    );
    state = {
      ...mockState,
      uploads: {
        'local-upload-id': {
          file: {
            metadata: {
              id: 'some-local-file-id',
              mimeType: 'some-type',
              upfrontId: Promise.resolve('some-local-upfront-file-id'),
              name: 'some-name',
              size: 42,
            },
          },
          events: [],
          tenant: {} as any,
          index: 0,
          timeStarted: 42,
          progress: null,
        },
        'other-upload-id': {
          file: {
            metadata: {
              id: 'some-other-local-file-id',
              mimeType: 'some-type',
              upfrontId: Promise.resolve('some-other-local-upfront-file-id'),
              name: 'some-name',
              size: 42,
            },
          },
          events: [],
          tenant: {} as any,
          index: 0,
          timeStarted: 42,
          progress: null,
        },
      },
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
    state = removeFileFromRecents(state, removeFromRecents);
    resultState = removeFileFromRecents(state, removeFromLocalUploads);
  });

  it('should remove file from recents list', () => {
    expect(resultState.recents.items).toHaveLength(1);
    expect(resultState.recents.items[0].id).toEqual('other-id');
  });
  it('should remove item from selected list', () => {
    expect(resultState.selectedItems).toHaveLength(1);
    expect(resultState.selectedItems[0].id).toEqual('other-id');
  });
  it('should remove local upload item', () => {
    expect(Object.keys(resultState.uploads)).toHaveLength(1);
    expect(Object.keys(resultState.uploads)[0]).toEqual('other-upload-id');
  });
});
