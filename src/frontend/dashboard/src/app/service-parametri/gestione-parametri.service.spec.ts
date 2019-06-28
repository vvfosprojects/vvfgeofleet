import { TestBed } from '@angular/core/testing';

import { GestioneParametriService } from './gestione-parametri.service';

describe('GestioneParametriService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestioneParametriService = TestBed.get(GestioneParametriService);
    expect(service).toBeTruthy();
  });
});
