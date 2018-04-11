import { ComponentClass } from 'react';
import { Props } from './pdfComponent';

export default (): Promise<ComponentClass<Props>> =>
  import(/* webpackChunkName:"@atlaskit-internal_media-viewer-pdf-viewer" */

  './pdfComponent').then(module => module.PDFViewer);
