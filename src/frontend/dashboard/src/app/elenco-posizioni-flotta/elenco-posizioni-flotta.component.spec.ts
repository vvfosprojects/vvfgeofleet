import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElencoPosizioniFlottaComponent } from './elenco-posizioni-flotta.component';

describe('ElencoPosizioniFlottaComponent', () => {
  let component: ElencoPosizioniFlottaComponent;
  let fixture: ComponentFixture<ElencoPosizioniFlottaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElencoPosizioniFlottaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElencoPosizioniFlottaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
