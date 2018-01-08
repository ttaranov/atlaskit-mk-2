import { Action } from 'redux';

import { isFileUploadsStartAction } from '../actions/fileUploadsStart';
import { LocalUpload, State } from '../domain';

export default function fileUploadsAdd(state: State, action: Action): State {
  if (isFileUploadsStartAction(action)) {
    const { tenant, uploads, selectedItems, lastUploadIndex } = state;

    const files = action.files;
    const newUploads: { [id: string]: LocalUpload } = {};

    let newLastUploadIndex = lastUploadIndex;
    files.forEach(
      file =>
        (newUploads[file.id] = {
          file: {
            metadata: {
              id: file.id,
              name: file.name,
              mimeType: file.type,
              size: file.size,
            },
            dataURI: '',
          },
          progress: 0,
          events: [], // uploads-start is not part of events. It will be emitted manually in importFiles.tsx
          index: newLastUploadIndex++, // this index helps to sort upload items, so that latest come first
          tenant,
        }),
    );

    const newSelectedItems = files.map(file => ({
      date: 0,
      id: file.id,
      mimeType: file.type,
      name: file.name,
      parentId: '',
      size: file.size,
      serviceName: 'upload',
    }));

    return {
      ...state,
      uploads: {
        ...uploads,
        ...newUploads,
      },
      selectedItems: [...selectedItems, ...newSelectedItems],
      lastUploadIndex: newLastUploadIndex,
    };
  } else {
    return state;
  }
}
