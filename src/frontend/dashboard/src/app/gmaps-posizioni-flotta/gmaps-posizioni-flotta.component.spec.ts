import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapsPosizioniFlottaComponent } from './gmaps-posizioni-flotta.component';

describe('GmapsPosizioniFlottaComponent', () => {
  let component: GmapsPosizioniFlottaComponent;
  let fixture: ComponentFixture<GmapsPosizioniFlottaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmapsPosizioniFlottaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapsPosizioniFlottaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
