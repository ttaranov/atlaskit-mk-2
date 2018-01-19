const mock = jest.fn();
mock.mockImplementation(fn => fn);
module.exports = mock;
