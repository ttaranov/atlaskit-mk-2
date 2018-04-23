import { ComponentClass } from 'react';
import { Props } from './pdfComponent';

const moduleLoader = () =>
  import(/* webpackChunkName:"@atlaskit-internal_media-viewer-pdf-viewer" */ './pdfComponent');

export const componentLoader: () => Promise<ComponentClass<Props>> = () =>
  moduleLoader().then(module => module.PDFViewer);
export const fetch = (url: string): Promise<Blob> =>
  moduleLoader().then(module => module.fetch(url));
