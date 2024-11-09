interface Position {
  x: number;
  y: number;
  z: number;
}

interface BaseComponent {
  id: string;
  type: string;
  depth: number;
  position: Position;
}

interface RectangleComponent extends BaseComponent {
  type: 'rectangle';
  width: number;
  height: number;
}

interface CylinderComponent extends BaseComponent {
  type: 'cylinder';
  radius: number;
}

interface HoleComponent extends BaseComponent {
  type: 'hole';
  radius: number;
}

type ModelComponent = RectangleComponent | CylinderComponent | HoleComponent;

interface Operation {
  type: 'subtract' | 'union' | 'intersect';
  targetId: string;
  modifierId: string;
}

interface Model {
  depth: number;
  components: ModelComponent[];
  operations: Operation[];
}

export interface ModelDefinition {
  model: Model;
  ai_model: Model | null;
}
