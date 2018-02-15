import { TestBed, inject } from '@angular/core/testing';

import { PosizioneFlottaService } from './posizione-flotta.service';

describe('PosizioneFlottaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PosizioneFlottaService]
    });
  });

  it('should be created', inject([PosizioneFlottaService], (service: PosizioneFlottaService) => {
    expect(service).toBeTruthy();
  }));
});
