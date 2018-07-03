import { ZoomLevel } from '../../../newgen/domain';

describe('ZoomLevel', () => {
  it('begins with a zoom level of 1 or 100%', () => {
    const zoomLevel = new ZoomLevel();
    expect(zoomLevel.value).toEqual(1);
    expect(zoomLevel.asPercentage).toEqual('100 %');
  });

  it('increases the zoom level when zooming in', () => {
    const zoomLevel = new ZoomLevel();
    expect(zoomLevel.zoomIn().value).toBeGreaterThan(zoomLevel.value);
  });

  it('decreases the zoom level when zooming out', () => {
    const zoomLevel = new ZoomLevel();
    expect(zoomLevel.zoomOut().value).toBeLessThan(zoomLevel.value);
  });

  it('will not decrease the zoom level when the minimum is reached', () => {
    const zoomLevel = new ZoomLevel(ZoomLevel.MIN);
    expect(zoomLevel.zoomOut().value).toEqual(zoomLevel.value);
  });

  it('will not increase the zoom level when the maximum is reached', () => {
    const zoomLevel = new ZoomLevel(ZoomLevel.MAX);
    expect(zoomLevel.zoomIn().value).toEqual(zoomLevel.value);
  });

  it('will report if zooming out is possible', () => {
    const zoomLevelDefault = new ZoomLevel();
    const zoomLevelMin = new ZoomLevel(ZoomLevel.MIN);
    expect(zoomLevelDefault.canZoomOut).toEqual(true);
    expect(zoomLevelMin.canZoomOut).toEqual(false);
  });

  it('will report if zooming in is possible', () => {
    const zoomLevelDefault = new ZoomLevel();
    const zoomLevelMax = new ZoomLevel(ZoomLevel.MAX);
    expect(zoomLevelDefault.canZoomIn).toEqual(true);
    expect(zoomLevelMax.canZoomIn).toEqual(false);
  });
});
