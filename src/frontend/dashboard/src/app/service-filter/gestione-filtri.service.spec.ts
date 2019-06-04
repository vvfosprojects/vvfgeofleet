import { TestBed } from '@angular/core/testing';

import { GestioneFiltriService } from './gestione-filtri.service';

describe('GestioneFiltriService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestioneFiltriService = TestBed.get(GestioneFiltriService);
    expect(service).toBeTruthy();
  });
});
