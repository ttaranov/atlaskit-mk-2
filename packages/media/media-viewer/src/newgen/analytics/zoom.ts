import { GasPayload } from '@atlaskit/analytics-gas-types';
import { context, PackageContext } from './index';

export type ZoomType = 'zoomOut' | 'zoomIn';
export interface ZoomControlsGasPayload extends GasPayload {
  attributes: PackageContext & {
    zoomScale: number;
  };
}

export function createZoomEvent(
  zoomType: ZoomType,
  zoomScale: number,
): ZoomControlsGasPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: zoomType,
    attributes: {
      zoomScale,
      ...context,
    },
  };
}
