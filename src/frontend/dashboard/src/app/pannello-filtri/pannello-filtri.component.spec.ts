import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PannelloFiltriComponent } from './pannello-filtri.component';

describe('PannelloFiltriComponent', () => {
  let component: PannelloFiltriComponent;
  let fixture: ComponentFixture<PannelloFiltriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PannelloFiltriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PannelloFiltriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
