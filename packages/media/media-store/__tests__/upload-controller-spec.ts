import { UploadController } from '../src';

describe('UploadController', () => {
  it('should call cancel function when is setted', () => {
    const controller = new UploadController();
    const cancel = jest.fn();

    controller.setCancel(cancel);
    expect(cancel).not.toBeCalled();
    controller.cancel();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
