const ReactDOMServer = require('react-dom/server');

import { Scene, Point, Model, ImageModel } from '../scene';
import { createRenderer } from '../rendering/renderers';

export class Exporter {
  constructor(private readonly scene: Scene) {}

  export(): Promise<string> {
    const { scene } = this;
    const canvas = document.createElement('canvas');
    const { size } = scene.boundingRect;
    canvas.width = size.width;
    canvas.height = size.height;

    const context = canvas.getContext('2d');
    if (!context) {
      return Promise.reject(new Error('Could not retrieve 2d context'));
    }

    return this.drawImages(scene, context)
      .then(() => this.drawShapes(scene, context))
      .then(() => canvas.toDataURL());
  }

  private drawImages(
    scene: Scene,
    context: CanvasRenderingContext2D,
  ): Promise<void> {
    const imageModels: ImageModel[] = scene.models
      .filter(model => model.type === 'image')
      .map(model => model as ImageModel);

    const drawPromises = imageModels.map(model => {
      return this.drawImage(context, model.url, model.rect.origin);
    });

    return Promise.all(drawPromises).then(() => {});
  }

  private drawShapes(
    scene: Scene,
    context: CanvasRenderingContext2D,
  ): Promise<void> {
    const notImageModels: Model[] = scene.models.filter(
      model => model.type !== 'image',
    );

    const shapesSvgs = notImageModels.map(model => {
      const renderer = createRenderer(model);
      if (!renderer) {
        return '';
      }

      return ReactDOMServer.renderToStaticMarkup(renderer);
    });

    const { origin, size } = scene.boundingRect;
    const { x, y } = origin;
    const { width, height } = size;

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${x +
      width} ${y + height}">
      ${shapesSvgs.join('\n')}
      </svg>
    `;

    console.log('SVG STRING', svgString);
    const blob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    return this.drawImage(context, url, { x: 0, y: 0 });
  }

  private drawImage(
    context: CanvasRenderingContext2D,
    url: string,
    origin: Point,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, -origin.x, -origin.y);
        resolve();
      };
      image.onerror = error => {
        console.log(error);
        reject(new Error('Could not render the image'));
      };

      image.src = url;
    });
  }
}
