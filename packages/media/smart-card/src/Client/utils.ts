export const append = <T>(arr: T[], x: T) => arr.concat([x]);

export const contains = <T>(arr: T[], x: T) => arr.indexOf(x) > -1;

export const inFisrtArrayButNotInSecond = <T>(fst: T[], snd: T[]): T[] =>
  fst.reduce(
    (res: T[], elff: T) => (!contains(snd, elff) ? append(res, elff) : res),
    [],
  );
