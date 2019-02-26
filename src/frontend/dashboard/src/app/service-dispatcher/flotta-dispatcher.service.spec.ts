import { TestBed } from '@angular/core/testing';

import { FlottaDispatcherService } from './flotta-dispatcher.service';

describe('FlottaDispatcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlottaDispatcherService = TestBed.get(FlottaDispatcherService);
    expect(service).toBeTruthy();
  });
});
