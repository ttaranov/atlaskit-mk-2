export type CardAppearance = 'inline' | 'block';
export type CardType = 'smart-card' | 'custom' | 'unsupported';

export interface CardProvider {
  getType(url: string): CardType;
  getData(url: string, appearance: CardAppearance): Promise<any>;
}

export interface CardOptions {
  provider?: Promise<CardProvider>;
}
