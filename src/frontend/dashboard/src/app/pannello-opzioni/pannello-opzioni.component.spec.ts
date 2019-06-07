import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PannelloOpzioniComponent } from './pannello-opzioni.component';

describe('PannelloOpzioniComponent', () => {
  let component: PannelloOpzioniComponent;
  let fixture: ComponentFixture<PannelloOpzioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PannelloOpzioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PannelloOpzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
