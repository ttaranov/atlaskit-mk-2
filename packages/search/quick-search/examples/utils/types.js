// @flow

export type OnClickActionSignature = (item: ItemShape) => void;

export type BaseItemShape = {
  resultId: string,
  type: string,
  avatarUrl: string,
  name: string,
  onClick?: OnClickActionSignature,
  href?: string,
};

export type ObjectItemShape = BaseItemShape & {
  containerName?: string,
  objectKey?: string,
};

export type PersonItemShape = BaseItemShape & {
  mentionName?: string,
  presenceMessage?: string,
  presenceState?: string,
};

export type ContainerItemShape = BaseItemShape & {
  caption?: string,
};

export type ItemShape = ObjectItemShape | PersonItemShape | ContainerItemShape;
