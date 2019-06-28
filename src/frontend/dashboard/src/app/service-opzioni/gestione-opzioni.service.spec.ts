import { TestBed } from '@angular/core/testing';

import { GestioneOpzioniService } from './gestione-opzioni.service';

describe('GestioneOpzioniService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestioneOpzioniService = TestBed.get(GestioneOpzioniService);
    expect(service).toBeTruthy();
  });
});
