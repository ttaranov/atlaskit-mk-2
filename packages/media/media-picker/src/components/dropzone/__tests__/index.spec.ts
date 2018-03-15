import * as sinon from 'sinon';
import { EventEmitter2 } from 'eventemitter2';
import { defaultServiceHost } from '@atlaskit/media-test-helpers';
import { MediaPicker } from '../../../index';
import { ModuleConfig } from '../../../domain/config';
import { Dropzone } from '../../dropzone';
import * as uploadService from '../../../service/uploadService';

const apiConfig = {
  apiUrl: defaultServiceHost,
  authProvider: () =>
    Promise.resolve({
      clientId: '603c5433-35c4-4346-9a18-2acd3e8df980',
      token: 'some-token',
    }),
} as ModuleConfig;

interface FakeUploadService extends EventEmitter2 {
  addDropzone?: () => void;
  removeDropzone?: () => void;
}

describe('Dropzone', () => {
  // Helper functions
  const createDragOverOrDropEvent = (
    eventName: 'dragover' | 'drop',
    type?: string,
  ) => {
    const event = document.createEvent('Event') as any;
    event.initEvent(eventName, true, true);
    event.preventDefault = () => {};
    event.dataTransfer = {
      types: [type || 'Files'],
      effectAllowed: 'move',
      items: [
        {
          kind: 'file',
        },
        {
          kind: 'string',
        },
      ],
    };

    return event;
  };

  const createDragOverEvent = (type?: string) => {
    return createDragOverOrDropEvent('dragover', type);
  };

  const createDropEvent = (type?: string) => {
    return createDragOverOrDropEvent('drop', type);
  };

  const createDragLeaveEvent = () => {
    const event = document.createEvent('Event') as any;
    event.initEvent('dragleave', true, true);
    event.preventDefault = () => {};

    return event;
  };

  describe('MediaPicker', () => {
    it('returns the Dropzone object when "dropzone" is specified', () => {
      const container = document.createElement('DIV');
      const pickerObj = MediaPicker('dropzone', apiConfig, { container });
      expect(pickerObj).toBeInstanceOf(Dropzone);
    });
  });

  describe('activate', () => {
    it('injects drop zone into supplied container', () => {
      const container = document.createElement('DIV');
      const dropzone = MediaPicker('dropzone', apiConfig, { container });

      return dropzone.activate().then(() => {
        expect(
          container.querySelectorAll('.mediaPickerDropzone').length,
        ).toEqual(1);
      });
    });

    it('injects drop zone into document.body if no container is supplied to constructor', () => {
      const dropzone = MediaPicker('dropzone', apiConfig);

      return dropzone.activate().then(() => {
        expect(
          document.body.querySelectorAll('.mediaPickerDropzone').length,
        ).toEqual(1);
      });
    });

    describe('displays dropzone UI', () => {
      it('should append "active" class to .mediaPickerDropzone on "dragover"', () => {
        const dragOver = createDragOverEvent();

        const container = document.createElement('DIV') as any;
        const dropzone = MediaPicker('dropzone', apiConfig, { container });

        dropzone.activate().then(() => {
          expect(
            container.querySelector('.mediaPickerDropzone')!.classList.contains(
              'active',
            ),
          ).toEqual(false);

          container.dispatchEvent(dragOver);
          expect(
            container.querySelector('.mediaPickerDropzone')!.classList.contains(
              'active',
            ),
          ).toEqual(true);
        });
      });

      it('should remove "active" class to .mediaPickerDropzone on "dragover"', () => {
        const dragOver = createDragOverEvent();
        const dragLeave = createDragLeaveEvent();

        const container = document.createElement('DIV') as any;
        const dropzone = MediaPicker('dropzone', apiConfig, { container });

        dropzone.activate().then(() => {
          container.dispatchEvent(dragOver);
          expect(
            container.querySelector('.mediaPickerDropzone')!.classList.contains(
              'active',
            ),
          ).toEqual(true);

          container.dispatchEvent(dragLeave);
          expect(
            container.querySelector('.mediaPickerDropzone')!.classList.contains(
              'active',
            ),
          ).toEqual(false);
        });
      });
    });
  });

  describe('deactivate', () => {
    let container: HTMLElement;
    let removeEventListenerSpy: jest.SpyInstance<any>;
    let dropzone: Dropzone;

    beforeEach(() => {
      container = document.createElement('div');
      removeEventListenerSpy = jest.spyOn(container, 'removeEventListener');
      dropzone = MediaPicker('dropzone', apiConfig, {
        container,
        headless: true,
      });
    });

    it('removes "dragover", "dragleave" and "drop" events from container', () => {
      return dropzone.activate().then(() => {
        dropzone.deactivate();
        const events = removeEventListenerSpy.mock.calls.map(args => args[0]);
        expect(events).toContain('dragover');
        expect(events).toContain('dragleave');
        expect(events).toContain('drop');
      });
    });
  });

  describe('MediaPickerDropzone emitted events', () => {
    let container: HTMLDivElement;
    let dropzone: Dropzone;
    let uploadServiceStub: sinon.SinonStub | undefined;
    let someFakeUploadService: FakeUploadService;

    const stubUploadService = (fakeUploadService: FakeUploadService) => {
      uploadServiceStub = sinon
        .stub(uploadService, 'UploadService')
        .returns(fakeUploadService);
    };

    beforeEach(() => {
      container = document.createElement('DIV') as HTMLDivElement;

      someFakeUploadService = new EventEmitter2();
      someFakeUploadService.addDropzone = () => {};
      someFakeUploadService.removeDropzone = () => {};
      stubUploadService(someFakeUploadService);

      dropzone = MediaPicker('dropzone', apiConfig, { container });
    });

    afterEach(() => {
      dropzone.deactivate();

      if (uploadServiceStub) {
        uploadServiceStub.restore();
        uploadServiceStub = undefined;
      }
    });

    it('should emit drag-enter for drag over with type "Files" and contain files length', done => {
      const dropzone = MediaPicker('dropzone', apiConfig, {
        container,
        headless: true,
      });

      dropzone.activate().then(() => {
        dropzone.on('drag-enter', e => {
          expect(e.length).toEqual(1);
          done();
        });

        container.dispatchEvent(createDragOverEvent());
      });
    });

    it('should not emit drag-enter for drag over with type "Not Files"', done => {
      const dropzone = MediaPicker('dropzone', apiConfig, {
        container,
        headless: true,
      });

      dropzone.activate().then(() => {
        dropzone.on('drag-enter', () => {
          done(new Error('drag-enter should not be emitted'));
        });

        container.dispatchEvent(createDragOverEvent('Not Files'));
        done();
      });
    });

    it('should emit drag-leave for dragleave event', done => {
      dropzone.activate().then(() => {
        dropzone.on('drag-leave', () => {
          done();
        });

        container.dispatchEvent(createDragOverEvent());
        container.dispatchEvent(createDragLeaveEvent());
      });
    });

    it('should not emit drag-leave for dragleave event if there was no dragover', done => {
      dropzone.activate().then(() => {
        dropzone.on('drag-leave', () => {
          done(new Error('drag-leave should not be emitted'));
        });

        container.dispatchEvent(createDragLeaveEvent());
        done();
      });
    });

    it('should fire "drop" event when upload-service fires "file-dropped" event and datatransfer.types array contains the string "Files"', done => {
      const dropzone = MediaPicker('dropzone', apiConfig, {
        container,
        headless: true,
      });

      dropzone.on('drop', () => {
        done();
      });

      dropzone.activate().then(() => {
        someFakeUploadService.emit('file-dropped', createDropEvent());
      });
    });

    it('should not fire "drop" event when upload-service fires "file-dropped" event and datatransfer.types array does not contain the string "Files"', done => {
      const dropzone = MediaPicker('dropzone', apiConfig, {
        container,
        headless: true,
      });

      dropzone.on('drop', () => {
        done(new Error('drop should not be emitted'));
      });

      dropzone.activate().then(() => {
        someFakeUploadService.emit(
          'file-dropped',
          createDropEvent('Not Files'),
        );
        done();
      });
    });
  });
});
