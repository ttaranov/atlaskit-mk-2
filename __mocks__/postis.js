/* eslint-disable */
const Postis = jest.fn();

const postisObject = {
  ready: jest.fn(),
  listen: jest.fn(),
  send: jest.fn(),
  destroy: jest.fn(),
};

Postis.mockReturnValue(postisObject);
Postis.channel = postisObject;

module.exports = Postis;
