export interface Document {
  id: string;
  objectId: string;
  containerId?: string;
  createdBy: User;
  language?: string;
  title?: string;
  body: string;
}

export interface User {}
