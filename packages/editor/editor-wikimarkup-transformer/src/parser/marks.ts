import { Mark, Schema } from 'prosemirror-model';

import { Effect } from '../interfaces';

/**
 * Create a new list of marks from effects
 */
export function effectsToMarks(schema: Schema, effects: Effect[]): Mark[] {
  const {
    code,
    em,
    strike,
    strong,
    subsup,
    textColor,
    underline,
  } = schema.marks;

  const marks = effects.map(({ name, attrs }) => {
    switch (name) {
      case 'color':
        return textColor.create(attrs);

      case 'emphasis':
      case 'citation':
        return em.create();

      case 'deleted':
        return strike.create();

      case 'strong':
        return strong.create();

      case 'inserted':
        return underline.create();
      case 'superscript':
        return subsup.create({ type: 'sup' });
      case 'subscript':
        return subsup.create({ type: 'sub' });
      case 'monospaced':
        return code.create();

      default:
        throw new Error(`Unknown effect: ${name}`);
    }
  });

  // some marks cannot be used together with others
  // for instance "code" cannot be used with "bold" or "textColor"
  // addToSet() takes care of these rules
  return marks.length ? marks[0].addToSet(marks.slice(1)) : [];
}
