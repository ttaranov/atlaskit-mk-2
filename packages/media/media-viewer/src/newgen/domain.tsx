import { Observable } from 'rxjs';
import { MediaType } from '@atlaskit/media-core';

export type FileDetails = {
  mediaType: MediaType;
};

export type RendererModel =
  | {
      type: 'LOADING';
    }
  | {
      type: 'SUCCESS';
      item: FileDetails;
    }
  | {
      type: 'FAILED';
      err: Error;
    };

export const initialModel: RendererModel = {
  type: 'LOADING'
};

export type DataSource = Observable<FileDetails>;