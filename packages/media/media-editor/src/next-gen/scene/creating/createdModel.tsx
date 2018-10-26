import { Model, Point, LinearModel } from '../';
import { Color, Tool } from '../../common';

// Describes a model that is being created.
// The purpose of this interface is that objects implementing it know how
// to update a specific model.
export interface CreatedModel {
  readonly model: Model;

  setNextPoint(end: Point): CreatedModel;
  setColor(color: Color): CreatedModel;
  setThickness(lineThickness: number): CreatedModel;
}

export function createModel(
  id: string,
  tool: Tool,
  startPoint: Point,
  color: Color,
  thickness: number,
): CreatedModel | null {
  switch (tool) {
    case 'line':
      return new CreatedLinearModel({
        id,
        type: 'line',
        start: startPoint,
        end: startPoint,
        color,
        thickness,
      });

    case 'rectangle':
      return new CreatedLinearModel({
        id,
        type: 'rectangle',
        start: startPoint,
        end: startPoint,
        color,
        thickness,
      });

    case 'oval':
      return new CreatedLinearModel({
        id,
        type: 'oval',
        start: startPoint,
        end: startPoint,
        color,
        thickness,
      });
  }

  return null;
}

class CreatedLinearModel implements CreatedModel {
  constructor(readonly linearModel: LinearModel) {}

  get model(): Model {
    return this.linearModel;
  }

  setNextPoint(end: Point): CreatedModel {
    return new CreatedLinearModel({
      ...this.linearModel,
      end,
    });
  }

  setColor(color: Color): CreatedModel {
    return new CreatedLinearModel({
      ...this.linearModel,
      color,
    });
  }

  setThickness(thickness: number): CreatedModel {
    return new CreatedLinearModel({
      ...this.linearModel,
      thickness,
    });
  }
}
