import { formatDuration } from '../../../src/newgen/utils/formatDuration';

describe('formatDuration', () => {
  it('should format seconds into readable format', () => {
    expect(formatDuration(0)).toEqual('0:00');
    expect(formatDuration(5)).toEqual('0:05');
    expect(formatDuration(10)).toEqual('0:10');
    expect(formatDuration(100)).toEqual('1:40');
    expect(formatDuration(60060)).toEqual('41:00');
  });
});
