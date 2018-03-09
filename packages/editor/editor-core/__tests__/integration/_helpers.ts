/**
 * This function will in browser context. Make sure you call `toJSON` otherwise you will get:
 * unknown error: Maximum call stack size exceeded
 * And, don't get too fancy with it ;)
 */
export const getDocFromElement = el => el.pmViewDesc.node.toJSON();
