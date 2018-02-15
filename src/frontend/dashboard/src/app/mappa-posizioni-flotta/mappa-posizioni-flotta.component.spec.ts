import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappaPosizioniFlottaComponent } from './mappa-posizioni-flotta.component';

describe('MappaPosizioniFlottaComponent', () => {
  let component: MappaPosizioniFlottaComponent;
  let fixture: ComponentFixture<MappaPosizioniFlottaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappaPosizioniFlottaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappaPosizioniFlottaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
