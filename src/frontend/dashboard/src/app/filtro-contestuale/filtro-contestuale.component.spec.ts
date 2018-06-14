import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroContestualeComponent } from './filtro-contestuale.component';

describe('FiltroContestualeComponent', () => {
  let component: FiltroContestualeComponent;
  let fixture: ComponentFixture<FiltroContestualeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroContestualeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroContestualeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
