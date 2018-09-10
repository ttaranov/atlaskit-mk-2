import hidePopupMiddleware from '../../hidePopup';
import { mockPopupUploadEventEmitter } from '../../../mocks';
import { hidePopup, HIDE_POPUP } from '../../../actions/hidePopup';

describe('hidePopupMiddleware', () => {
  const setup = () => ({
    eventEmitter: mockPopupUploadEventEmitter(),
    next: jest.fn(),
  });

  it(`should emit closed event given ${HIDE_POPUP} action`, () => {
    const { eventEmitter, next } = setup();

    hidePopupMiddleware(eventEmitter)()(next)(hidePopup());

    expect(eventEmitter.emitClosed).toHaveBeenCalledTimes(1);
  });

  it('should do nothing given other action', () => {
    const { eventEmitter, next } = setup();

    hidePopupMiddleware(eventEmitter)()(next)({ type: 'OTHER' });

    expect(eventEmitter.emitClosed).not.toBeCalled();
  });
});
