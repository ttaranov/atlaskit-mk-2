import { Scene, Rectangle, Model, ImageModel } from './scene';
import { Size } from './scene';

export class Content implements Scene {
  private static lastId = 0;

  boundingRect: Rectangle;
  models: Model[];

  constructor(private readonly onSceneChanged: Function) {
    this.boundingRect = {
      origin: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
    };
    this.models = [];
  }

  get nextId(): string {
    Content.lastId++;
    return `${Content.lastId}`;
  }

  backImageLoaded(url: string, size: Size) {
    const imageRect = {
      origin: { x: 0, y: 0 },
      size: size,
    };

    this.boundingRect = imageRect;

    this.models = [
      {
        type: 'image',
        id: this.nextId,
        url,
        rect: imageRect,
      } as ImageModel,
    ];

    this.onSceneChanged();
  }

  addModel(model: Model) {
    this.models.push(model);
    this.onSceneChanged();
  }
}
