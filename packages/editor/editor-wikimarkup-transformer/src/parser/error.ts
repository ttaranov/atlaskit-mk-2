export function error(message, input, line, column) {
  throw createError({
    message,
    line,
    column,
  });
}

function createError(props) {
  const err = Object.create(SyntaxError.prototype);

  Object.assign(err, props, {
    name: 'SyntaxError',
  });

  return err;
}
