const loadImageMock = jest.fn();
(loadImageMock as any).parseMetaData = jest.fn();

export default loadImageMock;
