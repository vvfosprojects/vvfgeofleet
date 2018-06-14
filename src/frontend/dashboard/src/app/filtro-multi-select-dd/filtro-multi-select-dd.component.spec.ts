import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroMultiSelectDdComponent } from './filtro-multi-select-dd.component';

describe('FiltroMultiSelectDdComponent', () => {
  let component: FiltroMultiSelectDdComponent;
  let fixture: ComponentFixture<FiltroMultiSelectDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroMultiSelectDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroMultiSelectDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
