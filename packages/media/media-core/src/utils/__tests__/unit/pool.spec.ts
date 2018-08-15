import { Pool } from '../../../providers/util/pool';

describe('Pool', () => {
  it('invokes the create function when creating the first item', () => {
    const pool = new Pool<number>();
    const createFn = jest.fn(() => 0);

    const v = pool.acquire('item', createFn);

    expect(v).toBe(0);
    expect(createFn).toHaveBeenCalledTimes(1);
  });

  it('does not invokes the create function when creating the second item', () => {
    const pool = new Pool<number>();
    const createFn = jest.fn(() => 0);

    const v1 = pool.acquire('item', createFn);
    const v2 = pool.acquire('item', createFn);

    expect(v1).toBe(v2);
    expect(createFn).toHaveBeenCalledTimes(1);
  });

  it('invokes the create function again when releasing all created items', () => {
    const pool = new Pool<number>();
    const createFn = jest.fn(() => 0);

    const v1 = pool.acquire('item', createFn);
    pool.release('item');
    const v2 = pool.acquire('item', createFn);

    expect(v1).toBe(v2);
    expect(createFn).toHaveBeenCalledTimes(2);
  });

  it('invokes the create function for separate ids multiple times', () => {
    const pool = new Pool<number>();
    const createFn = jest.fn(() => 0);

    pool.acquire('item1', createFn);
    pool.acquire('item2', createFn);

    expect(createFn).toHaveBeenCalledTimes(2);
  });
});
