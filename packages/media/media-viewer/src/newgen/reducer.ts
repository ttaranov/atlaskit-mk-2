import { Model, Action } from './domain';
import { Navigation, FileDetails, FilePreview, Outcome, Identifier, File } from './domain';
import { sameIdentifier } from './util';

const updateItemDetails = (identifier: Identifier, details: Outcome<FileDetails, Error>, items: File[]) => {
  return items.map(f => {
    if (sameIdentifier(f.identifier, identifier)) {
      return {
        ...f,
        fileDetails: details
      };
    } else {
      return f;
    }
  });
};

const updateItemPreview = (identifier: Identifier, preview: Outcome<FilePreview, Error>, items: File[]) => {
  return items.map(f => {
    if (sameIdentifier(f.identifier, identifier)) {
      return {
        ...f,
        filePreview: preview
      };
    } else {
      return f;
    }
  });
};

export const reduce = (model: Model, action: Action): Model => {
  // WARNING: we should be making inmutablre operations here with the model.
  // we may be also evaluating introducing a reducing library like Redux.
  switch(action.type) {
    case 'CLOSE':
      return model;
    case 'ITEM_DETAILS_UPDATE':
      const { identifier, details } = action.data;
      if (model.status === 'SUCCESSFUL'){
        model.data.left = updateItemDetails(identifier, details, model.data.left);
        model.data.right = updateItemDetails(identifier, details, model.data.right);
        model.data.selected = updateItemDetails(identifier, details, [model.data.selected])[0]
      }
      return model;
    case 'ITEM_PREVIEW_UPDATE':
      const { preview } = action.data;
      if (model.status === 'SUCCESSFUL'){
        model.data.left = updateItemPreview(action.data.identifier, preview, model.data.left);
        model.data.right = updateItemPreview(action.data.identifier, preview, model.data.right);
        model.data.selected = updateItemPreview(action.data.identifier, preview, [model.data.selected])[0]
      }
      return model;
    case 'LIST_UPDATE':
      return {
        status: 'SUCCESSFUL',
        data: {
          ...model.data,
          left: action.data.left,
          selected: action.data.selected,
          right: action.data.right
        }
      };
    case 'NAVIGATION_EVENT':
      if (model.status === 'SUCCESSFUL') {
        if (action.data === 'prev' && model.data.left.length > 0) {
            model.data.right.splice(0, 0, model.data.selected);
            model.data.selected = model.data.left[model.data.left.length - 1];
            model.data.left.splice(model.data.left.length - 1, 1);
        }
        if (action.data === 'next' && model.data.right.length > 0) {
            model.data.left.push(model.data.selected);
            model.data.selected = model.data.right[0];
            model.data.right.splice(0, 1);
        }
      }
      return model;
  }
}